//Creating a server with node
const path = require("path");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const csrf = require("csurf");
const flash = require("connect-flash");
//MongoDB
const mongoose = require("mongoose");
const MongoDBStore = require("connect-mongodb-session")(session);
//Models
const User = require("./models/user");
//Routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error");

const MONGODB_URI =
  "mongodb+srv://Lukas:mandarinas123@cluster0.qrzgg.mongodb.net/shop?retryWrites=true&w=majority";

const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
//*Apsauga pries CSRF atakas
const csrfProtection = csrf();

//* Middleware veikia tik i ateinancius requestus, paleidimo metu jie tik uzregistruojami

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "some long string value",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

app.use(async (req, res, next) => {
  try {
    if (req.session.user) {
      const user = await User.findById(req.session.user._id);
      req.user = user;
    }
  } catch (err) {
    console.log(err);
  }
  next();
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

//Handling errors
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log("connected to database...");
    app.listen(3000, () => console.log("Server is running..."));
  })
  .catch((err) => console.log(err));

//Creating a server with node
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
//MongoDB
const { mongoConnect } = require("./utils/database");
//Models
const User = require("./models/user");
//Routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");

const app = express();

//* Middleware veikia tik i ateinancius requestus, paleidimo metu jie tik uzregistruojami

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(async (req, res, next) => {
  try {
    const user = await User.findUserById("5fac04275d650c4b013af04e");
    req.user = new User(user.name, user.email, user.cart, user._id);
  } catch (err) {
    console.log(err);
  }

  next();
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminRoutes);
app.use(shopRoutes);

//Handling errors
app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});

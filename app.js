//Creating a server with node
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
//MongoDB
const mongoose = require("mongoose");
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
    const user = await User.findById("5fad380fcfedd917bc00877b");
    req.user = user;
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

mongoose
  .connect(
    "mongodb+srv://Lukas:mandarinas123@cluster0.qrzgg.mongodb.net/shop?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Lukas",
          email: "tikras@pastas.lt",
          cart: { items: [] },
        });
        user.save();
      }
    });

    console.log("connected to database...");
    app.listen(3000, () => console.log("Server is running..."));
  })
  .catch((err) => console.log(err));

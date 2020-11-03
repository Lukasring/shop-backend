//Creating a server with node
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const sequelize = require("./utils/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");

const app = express();

//* Middleware veikia tik i ateinancius requestus, paleidimo metu jie tik uzregistruojami

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next(); //svarbu sito nepamirst!
      // console.log("pridejus user i req");
    })
    .catch((err) => {
      console.log("!!! ERROR !!! app.js -> User middleware");
      console.log(err);
    });
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminRoutes);
app.use(shopRoutes);

//Handling errors
app.use(errorController.get404);
//* Associations, parodo sasajas tarp lenteliu
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product); // optional
User.hasOne(Cart);
Cart.belongsTo(User); // optional, virsuj .hasOne(Cart) jau nusako santyki
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

sequelize
  // .sync({ force: true }) // overrideina tabless
  .sync()
  .then(() => {
    // console.log(res);
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Lukas", email: "tikras@pastas.lt" });
    }
    return user;
  })
  .then((user) => {
    return user
      .getCart()
      .then((cart) => {
        if (!cart) {
          return user.createCart();
        }
        return cart;
      })
      .catch((err) => console.log(err));
  })
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));

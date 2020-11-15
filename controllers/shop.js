const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = async (req, res, next) => {
  try {
    //* galima ir su async await ir .then
    const products = await Product.find().exec();
    res.render("shop/product-list", {
      products: products,
      docTitle: "All Products",
      path: "/products",
      isAuthenticated: req.session.isLoggedIn,
    });

    // Product.find((err, products) => {
    //   if (err) console.log(err);
    //   res.render("shop/product-list", {
    //     products: products,
    //     docTitle: "All Products",
    //     path: "/products",
    //   });
    // });
  } catch (err) {
    console.log("!!! ERROR !!! controllers/shop.js -> getProducts", err);
  }
};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId);
    res.render("shop/product-detail", {
      docTitle: `${product.title} details`,
      path: "/products",
      product: product,
      isAuthenticated: req.session.isLoggedIn,
    });
  } catch (err) {
    console.log("!!! ERROR !!! controlers/shop.js -> getProduct");
    console.log(err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    let products = [];
    if (req.session.isLoggedIn) {
      const user = await req.user.execPopulate("cart.items.productId");
      products = user.cart.items;
    }
    // console.log(products);
    res.render("shop/cart", {
      docTitle: "Cart",
      path: "/cart",
      products: products,
      isAuthenticated: req.session.isLoggedIn,
    });
  } catch (err) {
    console.log("!!! ERROR !!! controllers/shop.js -> getCart");
    console.log(err);
  }
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    const product = await Product.findById(prodId);
    let productAdded = false;
    if (req.session.isLoggedIn) {
      productAdded = await req.user.addToCart(product);
    }

    if (productAdded) res.redirect("/cart");
  } catch (err) {
    console.log("!!! ERROR !!! controllers/shop.js -> postCart");
    console.log(err);
  }
};

exports.postDeleteCartItem = async (req, res, next) => {
  const prodId = req.body.productId;
  // console.log(prodId);
  try {
    const productRemoved = await req.user.removeFromCart(prodId);
    // console.log(productRemoved);s

    if (productRemoved) res.redirect("/cart");
  } catch (err) {
    console.log("!!! Error !!! controllers/shop.js -> postDeleteCartItem");
    console.log(err);
  }
};

exports.getCheckoutItems = (req, res, next) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "/checkout",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getIndex = (req, res, next) => {
  try {
    Product.find((err, products) => {
      if (err) console.log(err);
      res.render("shop/index", {
        products: products,
        docTitle: "shop",
        path: "/",
        isAuthenticated: req.session.isLoggedIn,
      });
    });
  } catch (err) {
    console.log("!!! ERROR !!!", err);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    let orderProducts = [];
    if (req.session.isLoggedIn) {
      const products = await req.user.execPopulate("cart.items.productId");
      orderProducts = products.cart.items.map((item) => {
        return {
          product: { ...item.productId._doc },
          quantity: item.quantity,
        };
      });
    }
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user._id,
      },
      products: orderProducts,
    });
    const orderSaved = await order.save();
    const cartCleared = await req.user.clearCart();
    // const productsOrdered = await req.user.addOrder();
    if (orderSaved && cartCleared) res.redirect("/orders");
  } catch (err) {
    console.log("!!! ERROR !!! controllers/shop.js -> postOrder");
    console.log(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    let orders = [];
    if (req.session.isLoggedIn) {
      orders = await Order.find({ "user.userId": req.user._id });
    }
    // console.log(orders);
    res.render("shop/orders", {
      orders: orders,
      docTitle: "Orders",
      path: "/orders",
      isAuthenticated: req.session.isLoggedIn,
    });
  } catch (err) {
    console.log("!!! ERROR !!! controllers/shop.js -> getOrders");
    console.log(err);
  }
};

const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  // console.log("*** MIDDLEWARE ***");
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      products: products,
      docTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getCartItems = (req, res, next) => {
  res.render("shop/cart", {
    docTitle: "Cart",
    path: "/cart",
  });
};

exports.getCheckoutItems = (req, res, next) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "/checkout",
  });
};

exports.getIndex = (req, res, next) => {
  res.render("shop/index", {
    docTitle: "Shop",
    path: "/",
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    docTitle: "Orders",
    path: "/orders",
  });
};

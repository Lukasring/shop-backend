const Product = require("../models/product");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
    res.render("shop/product-list", {
      products: products,
      docTitle: "All Products",
      path: "/products",
    });
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
    });
  } catch (err) {
    console.log("!!! ERROR !!! controlers/shop.js -> getProduct");
    console.log(err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const products = await req.user.getCart();
    // console.log(products);
    res.render("shop/cart", {
      docTitle: "Cart",
      path: "/cart",
      products: products,
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
    const productAdded = await req.user.addToCart(product);

    if (productAdded) res.redirect("/cart");
  } catch (err) {
    console.log("!!! ERROR !!! controllers/shop.js -> postCart");
    console.log(err);
  }
};

exports.postDeleteCartItem = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const productDestroyed = await req.user.deleteCartItem(prodId);

    if (productDestroyed) res.redirect("/cart");
  } catch (err) {
    console.log("!!! Error !!! controllers/shop.js -> postDeleteCartItem");
    console.log(err);
  }
};

exports.getCheckoutItems = (req, res, next) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "/checkout",
  });
};

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
    res.render("shop/index", {
      products: products,
      docTitle: "Shop",
      path: "/",
    });
  } catch (err) {
    console.log("!!! ERROR !!!", err);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    const productsOrdered = await req.user.addOrder();
    if (productsOrdered) res.redirect("/orders");
  } catch (err) {
    console.log("!!! ERROR !!! controllers/shop.js -> postOrder");
    console.log(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders();
    res.render("shop/orders", {
      orders: orders,
      docTitle: "Orders",
      path: "/orders",
    });
  } catch (err) {
    console.log("!!! ERROR !!! controllers/shop.js -> getOrders");
    console.log(err);
  }
};

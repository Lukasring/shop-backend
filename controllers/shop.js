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
    });
  } catch (err) {
    console.log("!!! ERROR !!! controlers/shop.js -> getProduct");
    console.log(err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const user = await req.user.execPopulate("cart.items.productId");
    const products = user.cart.items;
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
      });
    });
  } catch (err) {
    console.log("!!! ERROR !!!", err);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    const products = await req.user.execPopulate("cart.items.productId");
    // console.log(products.cart.items);
    const orderProducts = products.cart.items.map((item) => {
      return {
        product: { ...item.productId._doc },
        quantity: item.quantity,
      };
    });
    // console.log(orderProducts);
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
    const orders = await Order.find({ "user.userId": req.user._id });
    // console.log(orders);
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

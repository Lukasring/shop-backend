const Product = require("../models/product");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
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
    const product = await Product.findByPk(prodId);
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
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
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
    let newQuantity = 1;
    let product;

    const cart = await req.user.getCart();
    const products = await cart.getProducts({ where: { id: prodId } });
    if (products.length > 0) product = products[0];

    if (product) {
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1;
    } else {
      product = await Product.findByPk(prodId);
    }

    const productAdded = cart.addProduct(product, {
      through: { quantity: newQuantity },
    });

    if (productAdded) res.redirect("/cart");
  } catch (err) {
    console.log("!!! ERROR !!! controllers/shop.js -> postCart");
    console.log(err);
  }
};

exports.postDeleteCartItem = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts({ where: { id: prodId } });
    const product = products[0];
    const productDestroyed = await product.cartItem.destroy();

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
    const products = await Product.findAll();
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
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    const order = await req.user.createOrder();
    const productsOrdered = await order.addProducts(
      products.map((product) => {
        product.orderItem = { quantity: product.cartItem.quantity };
        return product;
      })
    );
    let cartEmptied;
    console.log(productsOrdered);
    if (productsOrdered) cartEmptied = cart.setProducts(null);
    if (cartEmptied) res.redirect("/orders");
  } catch (err) {
    console.log("!!! ERROR !!! controllers/shop.js -> postOrder");
    console.log(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders({ include: ["products"] });
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

const Product = require("../models/product");
const Cart = require("../models/cart");

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

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.getProductById(prodId, (product) => {
    res.render("shop/product-detail", {
      docTitle: `${product.title} details`,
      path: "/products",
      product: product,
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];

      products.forEach((product) => {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        console.log(cartProductData);
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      });
      // for (product in products) {
      //   const cartProductData = cart.products.find(
      //     (prod) => prod.id === product.id
      //   );
      //   console.log(cartProductData);
      //   if (cartProductData) {
      //     cartProducts.push({ productData: product, qty: cartProductData.qty });
      //   }
      // }
      console.log("***getCart***");
      console.log(cartProducts);
      res.render("shop/cart", {
        docTitle: "Cart",
        path: "/cart",
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.getProductById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
};

exports.getCheckoutItems = (req, res, next) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "/checkout",
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      products: products,
      docTitle: "Shop",
      path: "/",
    });
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    docTitle: "Orders",
    path: "/orders",
  });
};

const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  // console.log("*** MIDDLEWARE ***");
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      console.log(rows);
      res.render("shop/product-list", {
        products: rows,
        docTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log("!!! ERROR !!!", err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.getProductById(prodId)
    .then(([product, fieldData]) => {
      console.log(product[0]);
      res.render("shop/product-detail", {
        docTitle: `${product[0].title} details`,
        path: "/products",
        product: product[0],
      });
    })
    .catch((err) => {
      console.log("!!! ERROR !!! controlers/shop.js -> getProduct");
      console.log(err);
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

exports.postDeleteCartItem = (req, res, next) => {
  const prodId = req.body.productId;
  Product.getProductById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};

exports.getCheckoutItems = (req, res, next) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "/checkout",
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      console.log(rows);
      res.render("shop/index", {
        products: rows,
        docTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log("!!! ERROR !!!", err));
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    docTitle: "Orders",
    path: "/orders",
  });
};

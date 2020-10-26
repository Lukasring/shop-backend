const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join(
  path.dirname(require.main.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    //fetch current cart
    fs.readFile(FILE_PATH, (err, fileContnet) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContnet);
      }
      //check if item is already in cart
      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );

      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        //add new item/increase quantity
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      cart.totalPrice = cart.totalPrice + productPrice;

      fs.writeFile(FILE_PATH, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(FILE_PATH, (err, fileContnet) => {
      if (err) return;

      const cart = JSON.parse(fileContnet);
      const updatedCart = { ...cart };
      const product = updatedCart.products.find((product) => product.id === id);

      if (!product) return;

      updatedCart.products = updatedCart.products.filter(
        (product) => product.id !== id
      );
      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * product.qty;

      fs.writeFile(FILE_PATH, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(callback) {
    fs.readFile(FILE_PATH, (err, fileContnet) => {
      if (err) return callback(null);

      const cart = JSON.parse(fileContnet);
      callback(cart);
    });
  }
};

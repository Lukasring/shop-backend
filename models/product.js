const fs = require("fs");
const path = require("path");

const Cart = require("./cart");

const FILE_PATH = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

const readProductsFromFile = (callback) => {
  fs.readFile(FILE_PATH, (error, fileContent) => {
    if (error) return callback([]);
    callback(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(id, title, imageURL, description, price) {
    this.id = id;
    this.title = title;
    this.imageURL = imageURL;
    this.description = description;
    this.price = price;
  }

  static fetchAll(callback) {
    readProductsFromFile(callback);
  }

  static getProductById(id, callback) {
    readProductsFromFile((products) => {
      callback(products.find((product) => product.id === id));
    });
  }

  static deleteProduct(id) {
    readProductsFromFile((products) => {
      const product = products.find((product) => product.id === id);
      const updatedProducts = products.filter((product) => product.id !== id);
      fs.writeFile(FILE_PATH, JSON.stringify(updatedProducts), (err) => {
        if (err) console.log(err);
        if (!err) Cart.deleteProduct(id, product.price);
      });
    });
  }

  save() {
    readProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (product) => product.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(FILE_PATH, JSON.stringify(updatedProducts), (err) => {
          if (err) console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(FILE_PATH, JSON.stringify(products), (err) => {
          if (err) console.log(err);
        });
      }
    });
  }
};

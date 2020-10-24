const fs = require("fs");
const path = require("path");

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
  constructor(title, imageURL, description, price) {
    this.title = title;
    this.imageURL = imageURL;
    this.description = description;
    this.price = price;
  }

  static fetchAll = (callback) => {
    readProductsFromFile(callback);
  };

  save = () => {
    readProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(FILE_PATH, JSON.stringify(products), (err) => {
        if (err) console.log(err);
      });
    });
  };
};

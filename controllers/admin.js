const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    productCSS: true, // used for Handlebars templating
    formsCSS: true,
    activeAddProduct: true, // for handlebars
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageURL = req.body.imageURL;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(title, imageURL, description, price);
  product.save();
  // console.log(req.body);
  res.redirect("/");
};

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      products: products,
      path: "/admin/products",
      docTitle: "Product List",
    });
  });
};

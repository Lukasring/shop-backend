const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = !!req.query.edit; // sitas tik kad query params panaudot
  if (!editMode) return res.redirect("/");
  const prodId = req.params.productId;
  Product.getProductById(prodId, (product) => {
    if (!product) return res.redirect("/");
    res.render("admin/edit-product", {
      docTitle: "Edit Product",
      path: "/admin/edit-product",
      product: product,
      editing: editMode,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const title = req.body.title;
  const imageURL = req.body.imageURL;
  const price = +req.body.price;
  const description = req.body.description;
  const id = req.body.productId;
  console.log("editing product");
  console.log(title);
  const updatedProduct = new Product(id, title, imageURL, description, price);
  updatedProduct.save();
  res.redirect("/admin/products");
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageURL = req.body.imageURL;
  const price = +req.body.price;
  const description = req.body.description;

  const product = new Product(null, title, imageURL, description, price);
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

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.productId;
  Product.deleteProduct(id);
  res.redirect("/admin/products");
};

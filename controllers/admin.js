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
  Product.getProductById(prodId)
    .then(([product]) => {
      if (!product) return res.redirect("/");

      res.render("admin/edit-product", {
        docTitle: "Edit Product",
        path: "/admin/edit-product",
        product: product[0],
        editing: editMode,
      });
    })
    .catch((err) => {
      console.log("!!! ERROR !!! controllers/admin.js -> getEditProduct");
      console.log(err);
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
  product
    .save()
    .then(() => res.redirect("/"))
    .catch((err) => {
      console.log("!!! ERROR !!! controllers/admin.js -> postAddProduct");
      console.log(err);
    });
  // console.log(req.body);
};

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows]) => {
      res.render("admin/products", {
        products: rows,
        path: "/admin/products",
        docTitle: "Product List",
      });
    })
    .catch((err) => {
      console.log("!!! ERROR !!! controllers/admin.js -> getAdminProducts");
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.productId;
  Product.deleteProduct(id);
  res.redirect("/admin/products");
};

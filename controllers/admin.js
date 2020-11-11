const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = !!req.query.edit; // sitas tik kad query params panaudot
  if (!editMode) return res.redirect("/");
  const prodId = req.params.productId;
  // Product.findByPk(prodId)

  try {
    const product = await Product.findById(prodId);
    if (!product) return res.redirect("/");

    res.render("admin/edit-product", {
      docTitle: "Edit Product",
      path: "/admin/edit-product",
      product: product,
      editing: editMode,
    });
  } catch (err) {
    console.log("!!! ERROR !!! controllers/admin.js -> getEditProduct");
    console.log(err);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageURL = req.body.imageURL;
  const price = +req.body.price;
  const description = req.body.description;
  const id = req.body.productId;

  try {
    const product = new Product(title, price, description, imageURL, id);
    const productSaved = await product.save();
    if (productSaved) {
      res.redirect("/admin/products");
    }
  } catch (err) {
    console.log("!!! ERROR !!! controllers/admin.js -> postEditProduct");
    console.log(err);
  }
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageURL;
  const price = +req.body.price;
  const description = req.body.description;
  const userId = req.user._id;

  try {
    const product = new Product(title, price, description, imageUrl, userId);
    const result = await product.save();
    if (result) res.redirect("/admin/products");
  } catch (err) {
    console.log("!!! ERROR !!! controllers/admin.js postAddProduct");
    console.log(err);
  }
};

exports.getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
    res.render("admin/products", {
      products: products,
      path: "/admin/products",
      docTitle: "Product List",
    });
  } catch (err) {
    console.log("!!! ERROR !!! controllers/admin.js -> getAdminProducts");
    console.log(err);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const id = req.body.productId;
  // Product.destroy({where: {id: id}});
  try {
    const productDeleted = await Product.deleteById(id);
    if (productDeleted) res.redirect("/admin/products");
  } catch (err) {
    console.log("!!! ERROR !!! controllers/admin.js -> postDeleteProduct");
    console.log(err);
  }
};

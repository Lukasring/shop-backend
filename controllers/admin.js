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
    const products = await req.user.getProducts({ where: { id: prodId } });
    const product = products[0];
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
    const product = await Product.findByPk(id);
    product.title = title;
    product.imageUrl = imageURL;
    product.price = price;
    product.description = description;
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
  const imageURL = req.body.imageURL;
  const price = +req.body.price;
  const description = req.body.description;

  /* 
  User objekta storinam per middleware app.js faile,
  sequelize jam sukuria createProduct, kuris susieja userId su Product
  */
  try {
    const productCreated = await req.user.createProduct({
      title: title,
      price: price,
      imageUrl: imageURL,
      description: description,
    });
    if (productCreated) res.redirect("/admin/products");
  } catch (err) {
    console.log("!!! ERROR !!! controllers/admin.js postAddProduct");
    console.log(err);
  }
};

exports.getAdminProducts = async (req, res, next) => {
  try {
    const products = await req.user.getProducts();
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
    const product = await Product.findByPk(id);
    const productDeleted = await product.destroy();
    if (productDeleted) res.redirect("/admin/products");
  } catch (err) {
    console.log("!!! ERROR !!! controllers/admin.js -> postDeleteProduct");
    console.log(err);
  }
};

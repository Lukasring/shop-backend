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
  // Product.findByPk(prodId)

  req.user
    .getProducts({ where: { id: prodId } })
    .then(([product]) => {
      if (!product) return res.redirect("/");

      res.render("admin/edit-product", {
        docTitle: "Edit Product",
        path: "/admin/edit-product",
        product: product,
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

  Product.findByPk(id)
    .then((product) => {
      product.title = title;
      product.imageUrl = imageURL;
      product.price = price;
      product.description = description;
      return product.save();
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log("!!! ERROR !!! controllers/admin.js -> postEditProduct");
      console.log(err);
    });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageURL = req.body.imageURL;
  const price = +req.body.price;
  const description = req.body.description;

  /* 
  User objekta storinam per middleware app.js faile,
  sequelize jam sukuria createProduct, kuris susieja userId su Product
  */
  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageURL,
      description: description,
    })
    .then(() => {
      console.log("Product Created!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log("!!! ERROR !!! controllers/admin.js postAddProduct");
      console.log(err);
    });
  // console.log(req.body);
};

exports.getAdminProducts = (req, res, next) => {
  // Product.findAll()
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        products: products,
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
  // Product.destroy({where: {id: id}});
  Product.findByPk(id)
    .then((product) => product.destroy())
    .then(() => {
      console.log("Product deleted...");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log("!!! ERROR !!! controllers/admin.js -> postDeleteProduct");
      console.log(err);
    });
};

const path = require("path");

const express = require("express");

const rootDir = require("../utils/path");

const router = express.Router();

const products = [];

router.get("/add-product", (req, res, next) => {
  res.render("add-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    productCSS: true, // used for Handlebars templating
    formsCSS: true,
    activeAddProduct: true, // for handlebars
  });
});

router.post("/add-product", (req, res, next) => {
  products.push({ title: req.body.title });
  // console.log(req.body);
  res.redirect("/");
});

exports.router = router;
exports.products = products;

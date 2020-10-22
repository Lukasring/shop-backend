const path = require("path");

const express = require("express");

const rootDir = require("../utils/path");
const adminData = require("./admin");

const router = express.Router();

router.get("/", (req, res, next) => {
  // console.log("*** MIDDLEWARE ***");
  res.render("shop", {
    products: adminData.products,
    docTitle: "Shop",
    path: "/",
    productCSS: true,
    activeShop: true,
  });
});

module.exports = router;

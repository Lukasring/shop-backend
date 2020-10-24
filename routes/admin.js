const path = require("path");

const express = require("express");

// const rootDir = require("../utils/path");
const adminController = require("../controllers/admin");

const router = express.Router();

router.get("/add-product", adminController.getAddProduct);
router.get("/products", adminController.getAdminProducts);

router.post("/add-product", adminController.postAddProduct);

module.exports = router;

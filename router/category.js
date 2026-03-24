const express = require("express");
const route = express.Router();
const multer = require("multer");
const upload = multer();
const {CreateNewcategory, getallcategories} = require("../controllers/categoryController");
const { authMiddleware } = require("../middleware/aurthMiddleware");
const rolecheckmiddleware = require("../middleware/rolecheckmiddleware");
route.post("/create",authMiddleware,rolecheckmiddleware("admin"), upload.single("thumbnail"), CreateNewcategory);
route.post("/getall",getallcategories)
module.exports = route;

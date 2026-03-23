const express = require("express");
const route = express.Router();
const multer = require("multer");
const upload = multer();
const {CreateNewcategory} = require("../controllers/categoryController");
const { authMiddleware } = require("../middleware/aurthMiddleware");
const rolecheckmiddleware = require("../middleware/rolecheckmiddleware");
route.post("/create",authMiddleware,rolecheckmiddleware, upload.single("thumbnail"), CreateNewcategory);

module.exports = route;

const express = require("express");
const route = express.Router;
const multer = require("multer");
const upload = multer();
const CreateNewcategory = require("../controllers/categoryController");

route.post("/create",upload.single("thumbnail"), CreateNewcategory);

module.exports = route;

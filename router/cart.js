const express = require("express");
const { authMiddleware } = require("../middleware/aurthMiddleware");
const { addToCart, getAlCart, updatecart, removecart } = require("../controllers/addCartController");

const route = express.Router();

route.post("/add", authMiddleware, addToCart);
route.get("/getall",authMiddleware,getAlCart);
route.put("/update",authMiddleware,updatecart);
route.put("/delete",authMiddleware,removecart);

module.exports = route;

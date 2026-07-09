const express = require("express");
const { CheckOut } = require("../controllers/orderController");
const { authMiddleware } = require("../middleware/aurthMiddleware");

const route = express.Router();

route.post("/checkout", authMiddleware, CheckOut);
module.exports = route;

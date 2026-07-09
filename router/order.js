const express = require("express");
const { CheckOut } = require("../controllers/orderController");

const route = express.Router();

route.post("/place",CheckOut );
;

module.exports = route;

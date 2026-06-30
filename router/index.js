const express = require("express");
const route = express.Router();
const authRouter = require("./auth");
const productRouter = require("./product");

route.use("/auth", authRouter);
route.use("/category",require("./category"))
route.use("/product", productRouter);
route.use("/cart", require("./cart"));

module.exports = route;

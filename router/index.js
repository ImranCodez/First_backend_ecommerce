const express = require("express");
const route = express.Router();
const authRouter = require("./auth");
const productRouter = require("./product");
const orderRoute=require("./order")
const cart=require("./cart")
route.use("/auth", authRouter);
route.use("/category",require("./category"))
route.use("/product", productRouter);
route.use("/order", orderRoute);
route.use("/cart",cart );

module.exports = route;

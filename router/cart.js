const express = require("express")
const { authMiddleware } = require("../middleware/aurthMiddleware")
const addToCart = require("../controllers/addCartController")
const route = express.Router()



route.post("/add",authMiddleware,addToCart
)






module.exports=route
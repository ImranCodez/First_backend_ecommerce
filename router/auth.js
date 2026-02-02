const express = require("express");
const route = express.Router();
const { signupuser, singiuser, verifyOtp } = require("../controllers/authController");

route.post("/signup",signupuser);
route.post("/verifyotP",verifyOtp);
route.post("/singin",singiuser);

module.exports = route;

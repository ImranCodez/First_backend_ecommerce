const express = require("express");
const route = express.Router();
const { signupuser, singiuser, verifyOtp, regenerateOtp } = require("../controllers/authController");

route.post("/signup",signupuser);
route.post("/verifyOtp",verifyOtp);
route.post("/regenerateotp",regenerateOtp);
route.post("/singin",singiuser);

module.exports = route;

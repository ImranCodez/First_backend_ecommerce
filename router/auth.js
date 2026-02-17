const express = require("express");
const route = express.Router();
const { signupuser, singinuser, verifyOtp, regenerateOtp, forgatepass } = require("../controllers/authController");


route.post("/signup",signupuser);
route.post("/verifyOtp",verifyOtp);
route.post("/regenerateotp",regenerateOtp);
route.post("/signin",singinuser);
route.post("/forgetepass",forgatepass);

module.exports = route;

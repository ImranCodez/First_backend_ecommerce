const express = require("express");
const route = express.Router();
const { signupuser, singinuser, verifyOtp, regenerateOtp, forgatepass, resetpassword } = require("../controllers/authController");


route.post("/signup",signupuser);
route.post("/verifyOtp",verifyOtp);
route.post("/regenerateotp",regenerateOtp);
route.post("/signin",singinuser);
route.post("/forgetepass",forgatepass);
route.post("/resetpass/:token",resetpassword)

module.exports = route;

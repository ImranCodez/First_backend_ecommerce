const express = require("express");
const route = express.Router();
const { signupuser, singinuser, verifyOtp, regenerateOtp, forgatepass, resetpassword, getprofile, UpdateProfile } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/aurthMiddleware");

route.post("/signup",signupuser);
route.post("/verifyOtp",verifyOtp);
route.post("/regenerateotp",regenerateOtp);
route.post("/signin",singinuser);
route.post("/forgetepass",forgatepass);
route.get("/resetpass/:token",resetpassword);
route.get("/profile",authMiddleware,getprofile),
route.put("/profile",authMiddleware,UpdateProfile,),

module.exports = route;

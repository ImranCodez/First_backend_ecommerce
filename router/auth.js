const express = require("express");
const route = express.Router();
const {
  signupuser,
  singinuser,
  verifyOtp,
  regenerateOtp,
  forgatepass,
  resetpassword,
  getprofile,
  UpdateProfile,
  refreshrtoken,
} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/aurthMiddleware");
const multer = require("multer");
const upload = multer();
// const upload = require("../middleware/uploadmiddleware");

route.post("/signup", signupuser);
route.post("/verifyOtp", verifyOtp);
route.post("/regenerateotp", regenerateOtp);
route.post("/signin", singinuser);
route.post("/forgetepass", forgatepass);
route.get("/resetpass/:token", resetpassword);
(route.get("/profile", authMiddleware, getprofile),
  route.put("/profile", authMiddleware, upload.single("avatar"), UpdateProfile),

  route.post("/refreshtoken",refreshrtoken)
  (module.exports = route));

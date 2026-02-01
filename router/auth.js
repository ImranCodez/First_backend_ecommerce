const express = require("express");
const route = express.Router();
const { signupuser, singiuser } = require("../controllers/authController");

route.post("/signup",signupuser);
route.post("/singin",singiuser);

module.exports = route;

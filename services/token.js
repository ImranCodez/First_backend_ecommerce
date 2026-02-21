const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendResponse = require("./responsiveHandler");
const { json } = require("express");

const generateAccsToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
};
const generateRefToken = (user) => {
  return jwt.sign(
    {
      user: user._id,
      email: user.email,
      role: user.role,
    },

    process.env.JWT_SECRET,
    { expiresIn: "15d" },
  );
};
const resetpassToken = () => {
  return resetToken = crypto.randomBytes(16).toString("hex");
  // return Buffer.from(`${JSON.stringify(kisu_aktadeo)}`).toString("base64");
};

const verifyresetpass = (token) => {
  return JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
};
// .......verufytoken.....//
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("verfudsecoded", decoded);
    return decoded;
  } catch (error) {
    console.log("JWT Error:", error.message);
    return null;
  }
};

module.exports = {
  generateAccsToken,
  generateRefToken,
  resetpassToken,
  verifyToken,
  verifyresetpass,
};

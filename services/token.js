const jwt = require("jsonwebtoken");
const sendResponse = require("./responsiveHandler");

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
const resetpassToken = (user) => {
  return Buffer.from(`jbkjfbkjbd:imranhosain@gamil.com`).toString("base64");
};

const verifyresetpass = (token) => {
  return Buffer.from(tkn, "base64").toString("utf-8").split(":");
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

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
  return jwt.sign(
    {
      user: user._id,
      email: user.email,
    },

    process.env.JWT_SECRET,
    { expiresIn: "2h" },
  );
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

module.exports = { generateAccsToken, generateRefToken, resetpassToken,verifyToken };

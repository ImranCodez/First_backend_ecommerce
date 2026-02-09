const jwt = require("jsonwebtoken");

const generateAccsToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};
const generateRefToken = (User) => {
  return jwt.sign(
    {
      data: {
        User: user._id,
        email: user.email,
        role: user.role,
      },
    },
    process.env.JWT_SECRET,
    { expiresIn: "15d" },
  );
};

// .......verufytoken.....//
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};
module.exports = { generateAccsToken, generateRefToken, verifyToken };

const sendResponse = require("../services/responsiveHandler");
const { verifyToken } = require("../services/token");
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies;
    console.log(token["accessToken"]);
    if (!token["accessToken"]) return sendResponse(res, 400, "Invalid request");
    const decoded = verifyToken(token["accessToken"]);
    if (!decoded) return sendResponse(res, 400, "Invalid request");
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return sendResponse(res, 400, "Internal server errors");
  }
};

module.exports = { authMiddleware };

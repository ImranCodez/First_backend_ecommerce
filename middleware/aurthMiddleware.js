const sendResponse = require("../services/responsiveHandler");
const { verifyToken } = require("../services/token");
const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return sendResponse(res, 400, "Invalid1111111111111 request");
    const decoded = verifyToken(token);
    if (!decoded) return sendResponse(res, 400, "Invalid 2222222222 request");
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (error) {
    return sendResponse(res, 400, "Invalid 333333333 request");
    console.log(error);
  }
};

module.exports = { authMiddleware };

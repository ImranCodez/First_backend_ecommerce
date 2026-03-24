const sendResponse = require("../services/responsiveHandler");

const rolecheckmiddleware = (req, res,next) => {
  try {
    console.log("myuser",req.user);
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
  }
};

module.exports = rolecheckmiddleware;

const sendResponse = require("../services/responsiveHandler");

const rolecheckmiddleware = (req, res) => {
  try {
    console.log(req.user);
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
  }
};

module.exports = rolecheckmiddleware;

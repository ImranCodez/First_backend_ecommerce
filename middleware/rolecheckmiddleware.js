const sendResponse = require("../services/responsiveHandler");

const rolecheckmiddleware = (...roles) => {
  return (req, res,next)=>{
      try {
        if(roles.includes(req.user.role)){
          console.log("hea hoise")
          return next()
        }
        sendResponse(res,400,"invalid request");
        console.log(req?.user?.role)
    console.log(roles);
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
  }
  }
};

module.exports = rolecheckmiddleware;

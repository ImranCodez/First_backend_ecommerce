const cartSchema = require("../models/cartSchema");
const sendResponse = require("../services/responsiveHandler");

const CheckOut = async (req, res) => {
  try {
    const { paymentyp, CartId, deliveryCharge, insideDhaka, shippingAddress } =
      req.body;
      console.log(CartId);
      
    const CartData = await cartSchema.findById( CartId );
    console.log(CartData);
    
    return sendResponse(res, 200, CartData, true);
    if (!CartData) return sendResponse(res, 400, "Invalid request");
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Internal server error ");
  }
};
module.exports = { CheckOut };

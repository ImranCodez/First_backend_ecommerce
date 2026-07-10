const cartSchema = require("../models/cartSchema");
const orderSchema = require("../models/orderSchema");
const sendResponse = require("../services/responsiveHandler");
const CheckOut = async (req, res) => {
  try {
    const { paymentyp, CartId, deliveryCharge, insideDhaka, shippingAddress } =
      req.body;
    if (!paymentyp || !insideDhaka || !shippingAddress)
      return sendResponse(res, 400, "All fiel required");
    const orderNumber = `${Date.now()}`;
    if (!CartId) return sendResponse(res, 400, "Invalid request");
    const CartData = await cartSchema.findById(CartId);
    if (!CartData) return sendResponse(res, 400, "Invalid request");
    const charge = insideDhaka === "true" ? 70 : 120;
    const totalPrice = CartData.items.reduce((totall, current) => {
      return (totall += current.subtotal);
    }, charge);
    const orderData = new orderSchema({
      user: req.user?._id,
      items: CartData.items,
      deliveryCharge: charge,
      shippingAddress,
      insideDhaka,
      totalPrice,
      payment: {
        method: paymentyp,
      },
      orderNumber,
    });
    orderData.save();
    if (paymentyp === "cash") {
      return sendResponse(res, 200, "order placed successfully.", orderData);
    }
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Internal server error ");
  }
};
module.exports = { CheckOut };

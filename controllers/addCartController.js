const cartSchema = require("../models/cartSchema");
const productSchema = require("../models/productSchema");
const sendResponse = require("../services/responsiveHandler");

const addToCart = async (req, res) => {
  try {
    const { sku, quantity, productId } = req.body;
    if (!sku || !quantity || !productId)
      return sendResponse(res, 400, "Invalid request");
    const prodcutdata = await productSchema.findById(productId);
    const existingsku = await cartSchema.findOne({ sku });
    if(existingsku?.sku==sku) return sendResponse(res,400," this product already added")
    console.log(existingsku)
    const discountAmoount = prodcutdata.price * prodcutdata.discountpercentage;
    const diacountprice = prodcutdata.price - discountAmoount;
    const subtotall = prodcutdata.price * quantity;
    console.log(subtotall);

    await cartSchema.create({
      user: req.user._id,
      items: [
        {
          product: productId,
          sku,
          quantity,
          subtotall,
        },
      ],
    });
    return sendResponse(res, 201, true, " product added to cart", prodcutdata);
  } catch (error) {
    sendResponse(res, 500, false, "Internal server error");
    console.log(error);
  }
};
module.exports = addToCart;

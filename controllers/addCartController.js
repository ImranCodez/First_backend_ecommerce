const cartSchema = require("../models/cartSchema");
const productSchema = require("../models/productSchema");
const isvalid = require("../services/isvalidId");
const sendResponse = require("../services/responsiveHandler");
// .......create cart..//
const addToCart = async (req, res) => {
  try {
    const { productId, sku, quantity } = req.body;
    if (!productId || !sku || !quantity) {
      return sendResponse(res, 400, false, "All fields are required");
    }

    // Find Product
    const product = await productSchema.findById(productId);

    if (!product) {
      return sendResponse(res, 404, false, "Product not found");
    }

    // Find Variant
    const variant = product.variants.find((item) => item.sku === sku);
    console.log(variant);
    if (!variant) {
      return sendResponse(res, 404, false, "Invalid SKU");
    }

    // Stock Check
    if (variant.stock < quantity) {
      return sendResponse(res, 400, false, "Insufficient stock");
    }

    // Discount Price
    const discountAmount = (product.price * product.discountpercentage) / 100;
    const finalprice = product.price - discountAmount;
    let subtotal = finalprice * quantity;

    // Find Cart
    let cart = await cartSchema.findOne({
      user: req.user.id,
    });
    console.log(cart);
    // Create Cart if not exists
    if (!cart) {
      cart = new cartSchema({
        user: req.user.id,
        items: [],
      });
    }
    // Check Existing Item
    const existingItem = cart.items.find((item) => item.sku === sku);

    if (existingItem) {
      // Quantity Update       if items exist.....//
      if (existingItem.quantity + quantity > variant.stock) {
        return sendResponse(res, 400, false, "Stock limit exceeded");
      }
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: product._id,
        sku,
        quantity,
        subtotal,
      });
    }
    await cart.save();
    return sendResponse(res, 201, true, "Product added to cart", cart);
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, false, "Internal server error");
  }
};
// .......getcart part ....//
const getAlCart = async (req, res) => {
  try {
    const cartdata = await cartSchema.findOne({ user: req.user.id });
    console.log(cartdata);
    sendResponse(res, 200, " get all cart data success", cartdata);
  } catch (error) {
    console.log(error);
    sendResponse(res, 400, "Internal server error");
  }
};
// updated cart ..//
const updatecart = async (req, res) => {
  try {
    const { itemId, quantity, productId } = req.body;
    if (!itemId || !quantity || !productId)
      return sendResponse(res, 400, "Invalid error");
    if (!isvalid([itemId, productId]))
      return sendResponse(res, 400, "Invalid request");
    if (quantity < 1) return sendResponse(res, 400, "keep the item minimum 1");
    const product = await productSchema.findById(productId);
    const discountAmount = (product.price * product.discountpercentage) / 100;
    const finalprice = product.price - discountAmount;
    let subtotal = finalprice * quantity;
    console.log("itemId", req.user.id);
    const cart = await cartSchema
      .findOneAndUpdate(
        { user: req.user.id, "items._id": itemId },
        {
          $set: { "items.$.quantity": quantity, "items.$.subtotal": subtotal },
        },
        { new: true },
      )
      .select("items totalItems");
    console.log(cart);
    return sendResponse(res, 200, "cart updated sucessfully", cart);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Internal server error");
  }
};
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.body;
    if (!isValidId([itemId]))
      return responseHandler.error(res, 400, "Invalid Request");
    if (!itemId) return responseHandler.error(res, 400, "Invalid Request");
    const cart = await cartSchema
      .findOneAndUpdate(
        { user: req.user._id, "items._id": itemId },
        { $pull: { items: { _id: itemId } } },
        { new: true },
      )
      .select("items totalItems");
    responseHandler.success(res, 200, cart, "Cart Updated");
  } catch (error) {
    console.log(error);
    responseHandler.error(res, 500, "Server Error");
  }
};
module.exports = { addToCart, getAlCart, updatecart, removeFromCart };

const cartSchema = require("../models/cartSchema");
const productSchema = require("../models/productSchema");
const sendResponse = require("../services/responsiveHandler");

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

    if (!variant) {
      return sendResponse(res, 404, false, "Invalid SKU");
    }

    // Stock Check
    if (variant.stock < quantity) {
      return sendResponse(res, 400, false, "Insufficient stock");
    }

    // Discount Price
    const discountAmount =
      (product.price * product.discountpercentage) / 100;

    const finalPrice = product.price - discountAmount;

    // Find Cart
    let cart = await cartSchema.findOne({
      user: req.user.id,
    });

    // Create Cart if not exists
    if (!cart) {
      cart = new cartSchema({
        user: req.user.id,
        items: [],
      });
    }

    // Check Existing Item
    const existingItem = cart.items.find(
      (item) => item.sku === sku
    );

    if (existingItem) {
      // Quantity Update
      if (existingItem.quantity + quantity > variant.stock) {
        return sendResponse(
          res,
          400,
          false,
          "Stock limit exceeded"
        );
      }

      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: product._id,
        sku,
        quantity,
        price: finalPrice,
      });
    }

    await cart.save();

    return sendResponse(
      res,
      201,
      true,
      "Product added to cart",
      cart
    );
  } catch (error) {
    console.log(error);
    return sendResponse(
      res,
      500,
      false,
      "Internal server error"
    );
  }
};

module.exports = addToCart;
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: [orderItemSchema],

    totalItems: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// .....Automatically calculate totals...//
orderSchema.pre("save", function () {
  this.totalItems = this.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

});

module.exports = mongoose.model("Cart", orderSchema);

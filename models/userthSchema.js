const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const sendResponse = require("../services/responsiveHandler");

const userAuthSchema = new mongoose.Schema(
  {
    avatar:{
      type:String,
    },
    fullname: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      default: "admin",
      enum: ["admin", "user","editor"],
    },
    isVerified: {
      type: Boolean,
      default:false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
    },
    resetPasstken: {
      type: String,
    },
    resetExpire: {
      type: Date,
    },
  },
  { timestamps: true },
);

// 🔐 Hash password before save
userAuthSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return;

  try {
    user.password = await bcrypt.hash(user.password, 10);
  } catch (err) {
    sendResponse(res, 500, "Internal server error");
    console.log(err);
  }
});

// 🔑 Compare password method.../
userAuthSchema.methods.comparePassword = async function (enteredPassword) {
  const user = this;
  return bcrypt.compare(enteredPassword, user.password);
};

module.exports = mongoose.model("user", userAuthSchema);

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userAuthSchema = new mongoose.Schema(
  {
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
      default: "user",
      enum: ["admin", "user"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
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
    console.log(err)
  }
});

// 🔑 Compare password method
userAuthSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, user.password);
};

module.exports = mongoose.model("User", userAuthSchema);

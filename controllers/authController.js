const { isValidEmail } = require("../services/validation");
const userSchema = require("../models/userthSchema");
const sendEmail = require("../services/emailSender");
const generateotp = require("../services/helpers");

const signupuser = async (req, res) => {
  try {
    const { fullname, email, password, phone, address, role } = req.body;

    if (!fullname)
      return res.status(400).send({ message: "Fullname is required" });
    if (!email) return res.status(400).send({ message: "Email is required" });
    if (!isValidEmail(email))
      return res.status(400).send({ message: "Invalid email" });
    if (!password)
      return res.status(400).send({ message: "Password is required" });
    const existingUser = await userSchema.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser)
      return res
        .status(400)
        .send({ message: "User already exists with this email" });
    const gnerateOTP = generateotp();

    const user = new userSchema({
      fullname,
      email: email.toLowerCase(),
      password,
      phone,
      role,
      address,
      otp: gnerateOTP,
      otpExpires: Date.now() + 2 * 60 * 1000,
    });
    sendEmail({ email, subject: "Email varification", otp: gnerateOTP });

    user.save();
    console.log("hea hocce vai");
    res.status(201).send({ message: "Registration successful" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
  }
};
 // .......otp verify......//
  const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body; 
    if (!email) return res.status(400).send("email is required");
    if (!otp) return res.status(400).send("otp is required");
    const user = await userSchema.findOne({ email });
     console.log(user);
    if (!user) return res.status(404).send("User not found");

    res.send("OTP route working");

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server error");
  }
};

const singiuser = (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).send({ message: "email is required" });
  if (!password)
    return res.status(400).send({ message: "password is required" });
  res.status(200).send({ message: "Login is sucessful" });
};
module.exports = { signupuser, singiuser, verifyOtp };

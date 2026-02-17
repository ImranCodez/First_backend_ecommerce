const { isValidEmail } = require("../services/validation");
const userSchema = require("../models/userthSchema");
const { sendEmail } = require("../services/emailSender");
const { generateAccsToken, generateRefToken, resetpassToken } = require("../services/token");
const sendResponse = require("../services/responsiveHandler");
const { resetpasstemplate, emailvarifyTemplate } = require("../services/emailverifyTemplate");
const generateotp = require("../services/helpers");

// ...........signup part...//
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
    const generateOTP = generateotp();

    const user = new userSchema({
      fullname,
      email: email.toLowerCase(),
      password,
      phone,
      role,
      address,
      otp: generateOTP,
      otpExpires: Date.now() + 2 * 60 * 1000,
    });
    sendEmail({ email, subject:"Email varification",template:emailvarifyTemplate, otp:generateOTP });
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

    // 1️⃣ Validation
    if (!email) return res.status(400).send("email is required");
    if (!otp) return res.status(400).send("otp is required");

    // 2️⃣ Find user
    const user = await userSchema.findOne({ email });
    if (!user) return res.status(404).send("User not found");

    // 3️⃣ Check OTP match
    if (user.otp !== otp) {
      return res.status(400).send("Invalid OTP");
    }

    // 4️⃣ Check OTP expiry
    if (user.otpExpires < Date.now()) {
      return res.status(400).send("OTP expired");
    }

    // 5️⃣ Update user (verify)
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    // 6️⃣ Save to DB
    await user.save();

    // 7️⃣ Success response
    res.status(200).send({
      message: "Email verified successfully",
      isVerified: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server error");
  }
};
// ........regenerate........//
const regenerateOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).send("emai is required");
    const user = await userSchema.findOne({ email, isVerified: false });
    if (!user) return res.status(400).send("Invalid email");
    const generateOTP = generateotp();
    user.otp = generateOTP;
    user.otpExpires = Date.now() * 2 * 60 * 1000;
    sendEmail({ email, subject:"Email varification",template:emailvarifyTemplate, otp:generateOTP });
    res.status(201).send({ message: "otp send your email is succcessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};
// ..signin part .....//
const singinuser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) return res.status(400).send({ message: "email is required" });
    if (!password)
      return res.status(400).send({ message: "password is required" });
    const existingUser = await userSchema.findOne({ email });
    if (!existingUser)
      return res
        .status(404)
        .send({ messsage: "with this email user not   exist" });
    const matchpass = await existingUser.comparePassword(password);
    if (!matchpass) return res.status(400).send({ message: "wrong password" });

    if (!existingUser.isVerified)
      return sendResponse(res, 400, "Email is not verified");

    const token = generateAccsToken(existingUser);
    const reftoken = generateRefToken(existingUser);
    const cookieAcsOptions = {
      httpOnly: false, // Prevents client-side JavaScript from accessing the cookie, mitigating XSS
      maxAge: 1000 * 60 * 15, // Cookie expiry time in milliseconds (e.g., 15 minutes)
      secure: false, // Ensures the cookie is only sent over HTTPS (set to false for local HTTP development)
      // sameSite: 'Strict', // Mitigates CSRF attacks by ensuring cookies are only sent for same-site requests
    };
    const cookieRFcsOptions = {
      httpOnly: false,
      maxAge: 1296000000, // Cookie expiry time in milliseconds (e.g., 15 days)
      secure: false,
      // sameSite: 'Strict',
    };

    res.cookie("accessToken", token, cookieAcsOptions);
    res.cookie("x-Xreftoken", reftoken, cookieRFcsOptions);

    res.status(200).send({ message: "Login is sucessful" });
  } catch (error) {
    console.log(error);
  }
};
// ........forgatepass............//
const forgatepass = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return sendResponse(res, 400, "email is required");
    if (!isValidEmail(email))
      return sendResponse(res, 400, "enter a valid email adress");
    const existingUser = await userSchema.findOne({ email });
    if(!existingUser)return sendResponse(res,404,"with this email user not exist");
      const reserpasstoken= resetpassToken(existingUser)

    let ResetLink=`${process.env.CLIEN_URL||"http://localhost:8000/"}/resetpass/?${reserpasstoken}`;
    sendEmail({ email, subject: "reset your password",otp:ResetLink,template:resetpasstemplate});
    sendResponse(res,200,"find the reset passsword link in email",true)
  } catch (error) {
    sendResponse(res,400,"Internal server error")
    console.log(error)
  }
};
module.exports = { signupuser, singinuser, verifyOtp, regenerateOtp,forgatepass };

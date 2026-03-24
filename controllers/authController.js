const { isValidEmail } = require("../services/validation");
const User = require("../models/userthSchema");
const { sendEmail } = require("../services/emailSender");
const {
  generateAccsToken,
  generateRefToken,
  resetpassToken,
  hashverifytoken,
  verifyToken,
} = require("../services/token");
const sendResponse = require("../services/responsiveHandler");
const {
  resetpasstemplate,
  emailvarifyTemplate,
} = require("../services/emailverifyTemplate");
const generateotp = require("../services/helpers");
const { UploadTcloudinery } = require("../services/cloudinerservice");
const { DeletfromConfig } = require("../services/cloudinerservice");
// ...........signup part...//
const signupuser = async (req, res) => {
  try {
    const { fullname, email, password, phone, address, role } = req.body;
    if (!fullname) return sendResponse(res, 400, "fullname is required");
    if (!email) return sendResponse(res, 400, "email is required");
    if (!isValidEmail(email))
      return sendResponse(res, 400, " email is not valid");
    if (!password) return sendResponse(res, 400, "password is required");
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser)
      return sendResponse(res, 400, "User already exists with this email");
    const generateOTP = generateotp();
    const user = new User({
      fullname,
      email: email.toLowerCase(),
      password,
      phone,
      role,
      address,
      otp: generateOTP,
      otpExpires: Date.now() + 2 * 60 * 1000,
    });
    sendEmail({
      email,
      subject: "Email varification",
      template: emailvarifyTemplate,
      otp: generateOTP,
    });
    user.save();
    sendResponse(res, 201, "signup is successfull");
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
    console.log(error);
  }
};
// ..signin part .....//
const singinuser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) return res.status(400).send({ message: "email is required" });
    if (!password)
      return res.status(400).send({ message: "password is required" });

    const existingUser = await User.findOne({ email });
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
      maxAge: 1000 * 60 * 40, // Cookie expiry time in milliseconds (e.g., 15 minutes)
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

    sendResponse(res, 200, "Login is succesfull", true);
  } catch (error) {
    console.log(error);
  }
};
// .......otp verify......//
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
       console.log(email,otp)
    // 1️⃣ Validation
    if (!email) return res.status(400).send("email is required");
    if (!otp) return res.status(400).send("otp is required");

    // 2️⃣ Find user
    const user = await User.findOne({ email });
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

    res.status(200).send({
      message: "Email verified successfully",
      isVerified: true,
    });
  } catch (error) {
     sendResponse(res,500,"Internal server error")
    console.error(error);
  
  }
};
// ........regenerate........//
const regenerateOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return sendResponse(res, 400, "email is required");

    const user = await User.findOne({ email, isVerified: false });

    if (!user) return sendResponse(res, 400, "Invalid email");

    const generateOTP = generateotp();

    user.otp = generateOTP;
    user.otpExpires = Date.now() + 2 * 60 * 1000;

    await user.save();

    await sendEmail({
      email,
      subject: "Email verification",
      template: emailvarifyTemplate,
      otp: generateOTP,
    });

    sendResponse(
      res,
      201,
      "OTP sent successfully",
      true,
      generateOTP
    );

  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Internal server error");
  }
};
// ........forgatepass............//
const forgatepass = async (req, res) => {
  try {
    const user = await userSchema
      .findOne({ email: req.body.email })
      .select("_id email");
    if (!user) {
      return sendResponse(res, 404, "with this email user not exist");
    }
    const { resetPasswordToken, resetToken } = resetpassToken();
    user.resetPasstken = resetPasswordToken;
    user.resetExpire = Date.now() + 15 * 60 * 1000;
    user.save();
    let ResetLink = `${"http://localhost:8000/"}auth/resetpass/${resetToken}`;
    sendEmail({
      email: user.email,
      subject: "reset your password",
      otp: ResetLink,
      template: resetpasstemplate,
    });
    sendResponse(res, 200, "find the reset passsword link in email", true);
  } catch (error) {
    sendResponse(res, 400, "Internal server error");
  }
};
const resetpassword = async (req, res) => {
  try {
    const { newpass } = req.body;
    const { token } = req.params;
    if (!newpass) return sendResponse(res, 400, "New password is required");
    if (!token) return sendResponse(res, 400, "page is not found");
    const verfyhashtoken = hashverifytoken(token);
    const dbuser = await userSchema.findOne({
      resetPasstken: verfyhashtoken,
      resetExpire: { $gt: Date.now() },
    });
    if (!dbuser) return sendResponse(res, 400, "Invalid request");
    dbuser.password = newpass;
    dbuser.resetPasstken = undefined;
    dbuser.resetExpire = undefined;
    dbuser.save();
    sendResponse(res, 200, "password updated successfull", true);
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
    console.log(error);
  }
};
const getprofile = async (req, res) => {
  try {
    const user = await userSchema
      .findById(req.user.id)
      .select("-otp -updatedAt -otpExpires");
    if (!user) return sendResponse(res, 400, "Inavlid request");

    sendResponse(res, 200, "", true, user);
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
  }
};

const UpdateProfile = async (req, res) => {
  try {
    const { fullname, address, phone } = req.body;
    const UserId = req.user.id;
    const avatar = req.file;
    const user = await userSchema
      .findById(UserId)
      .select("-password -isVerified -otp -otpExpires -createdAt -updatedAt");
    // cloudinerAcout_1
    if (avatar) {
      // https://res.cloudinary.com/doyafbivx/image/upload/v1772552335/avatar/mxuamgwizfsusq4x5lpl.png

      const PublicId = user.avatar.split("/").pop().split(".")[0];
      DeletfromConfig(`avatar/${PublicId}`);
      const imaggeres = await UploadTcloudinery(avatar, "avatar");
      user.avatar = imaggeres.secure_url;
    }
    if (fullname) user.fullname = fullname;
    if (address) user.address = address;
    if (phone) user.phone = phone;
    user.save();
    sendResponse(res, 201, "your update is scucessfull", true, user);
  } catch (error) {
    sendResponse(res, 500, "Inernal server error Boss!");
  }
};

//  ...regenerate accstoekn using refreshtoken..........//
const refreshrtoken = async (req, res) => {
  try {
    const refreshtoken =
      req.cookies?.["x-Xreftoken"] || req.headers.authorization;
    if (!refreshtoken) return sendResponse(res, 400, "Refresh token missing");

    // ........verfy...//
    const decoded = verifyToken(refreshtoken);
    if (!decoded) return sendResponse(res, 400, "");
    const accessToken = generateAccsToken(decoded);
    const cookieAcsOptions = {
      httpOnly: false, // Prevents client-side JavaScript from accessing the cookie, mitigating XSS
      maxAge: 1000 * 60 * 40, // Cookie expiry time in milliseconds (e.g., 15 minutes)
      secure: false, // Ensures the cookie is only sent over HTTPS (set to false for local HTTP development)
      // sameSite: 'Strict', // Mitigates CSRF attacks by ensuring cookies are only sent for same-site requests
    };
    req.cookie("accessToken", accessToken, cookieAcsOptions);
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
    console.log(error);
  }
};
module.exports = {
  signupuser,
  verifyOtp,
  regenerateOtp,
  singinuser,
  forgatepass,
  resetpassword,
  getprofile,
  UpdateProfile,
  refreshrtoken,
};

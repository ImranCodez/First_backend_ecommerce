const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: "imranhossaianratul@gmail.com",
    pass: "nfavstokanechgpt",
  },
});

const sendEmail = async ({ email, subject, otp,template }) => {
  await transporter.sendMail({
    from: `"E-commerce"`,
    to: email,
    subject,
    html:template({otp}),
  });
};

module.exports = {sendEmail};

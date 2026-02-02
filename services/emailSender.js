const nodemailer = require("nodemailer");
const emaivarifyTemplate = require("./emailverifyTemplate");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: "imranhossaianratul@gmail.com",
    pass: "nfavstokanechgpt",
  },
});

const sendEmail = async ({ email, subject, otp }) => {
  await transporter.sendMail({
    from: `"E-commerce"`,
    to: email,
    subject,
    html: emaivarifyTemplate(otp),
  });
};

module.exports = sendEmail;

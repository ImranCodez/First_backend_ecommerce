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

const sendEmail = async ({ email, subject, otp }) => {
  await transporter.sendMail({
    from: `"E-commerce"`,
    to: email,
    subject,
    html: `
      <h1 email verification otp">${otp}</h1>
    
    `,
  });
};

module.exports = sendEmail;

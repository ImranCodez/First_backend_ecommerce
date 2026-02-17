const emailvarifyTemplate = (otp) => {
  return `
    <div style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:6px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:#4f46e5; padding:20px; text-align:center;">
              <h1 style="color:#ffffff; margin:0; font-size:24px;">
                Verify Your Email
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333333;">
              <p style="margin:0 0 15px; font-size:16px;">
                Hi! <strong> ashik er bow re chudi</strong>,
              </p>

              <p style="margin:0 0 20px; font-size:16px; line-height:1.5;">
                Thanks for signing up! Please verify your email address using the button or code below.
              </p>

              <!-- Verification Button -->
              <table cellpadding="0" cellspacing="0" style="margin:20px 0;">
                <tr>
                  <td align="center">
                    <a
                      href="/
                         https://web.facebook.com/profile.php?id=100092535758166&rdid=iG"
                      style="
                        background:#4f46e5;
                        color:#ffffff;
                        padding:12px 24px;
                        text-decoration:none;
                        border-radius:4px;
                        font-size:16px;
                        display:inline-block;
                        
                      "
                    >
                      Verify Email
                    </a>
                  </td>
                </tr>
              </table>

              <!-- OR -->
              <p style="margin:20px 0 10px; font-size:14px; text-align:center; color:#666;">
                OR
              </p>

              <!-- Verification Code -->
              <p
                style="
                  text-align:center;
                  font-size:24px;
                  letter-spacing:4px;
                  font-weight:bold;
                  background:#f4f4f4;
                  padding:12px;
                  border-radius:4px;
                  margin:0 auto 20px;
                  width:fit-content;
                "
              >
                ${otp}
              </p>

              <p style="font-size:14px; color:#666666;">
                This verification code will expire in 10 minutes.
              </p>

              <p style="font-size:14px; color:#666666;">
                If you didn’t create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f4f4f4; padding:15px; text-align:center; font-size:12px; color:#888888;">
              © ${new Date().getFullYear()} Your Company. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</div>`;
};
// .........resetpassword template ..........//
const resetpasstemplate = (ResetLink) => {
  return `<div style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4; padding:20px 0;">
    <tr>
      <td align="center">
        
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#4F46E5; padding:30px;">
              <h1 style="color:#ffffff; margin:0; font-size:24px;">Reset Your Password</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333333; font-size:16px; line-height:1.6;">
              <p style="margin-top:0;">Hi {{UserName}},</p>
              
              <p>
                We received a request to reset your password. Click the button below to choose a new one.
              </p>

              <!-- Button -->
              <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:30px auto;">
                <tr>
                  <td align="center" style="background-color:#4F46E5; border-radius:5px;">
                    <a href="/${ResetLink}" target="_blank"
                       style="display:inline-block; padding:12px 24px; font-size:16px; color:#ffffff; text-decoration:none; border-radius:5px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <p>
                If you didn’t request a password reset, you can safely ignore this email. Your password will not be changed.
              </p>

              <p>
                This link will expire in <strong>30 minutes</strong> for security reasons.
              </p>

              <p style="margin-bottom:0;">
                Thanks,<br>
                The {{CompanyName}} Team
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:#f9fafb; padding:20px; font-size:12px; color:#888888;">
              © {{Year}} {{CompanyName}}. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</div>`;
};
module.exports = { emailvarifyTemplate, resetpasstemplate };

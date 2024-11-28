import nodemailer from "nodemailer";

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Replace with your SMTP server (e.g., Gmail, Outlook)
  port: 587, // For secure connection, use 465; for unencrypted, use 587
  secure: false, // Use true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// Function to send an OTP
const sendOtpEmail = async (to, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your App Name" <${process.env.EMAIL_USER}>`, // Sender address
      to, // Recipient's email address
      subject: "Your OTP Code", // Subject line
      text: `Your OTP code is ${otp}.`, // Plain text body
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f9;
              }
              .email-container {
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .email-header {
                background: #4caf50;
                color: #ffffff;
                padding: 20px;
                text-align: center;
              }
              .email-header h1 {
                margin: 0;
                font-size: 24px;
              }
              .email-body {
                padding: 20px;
                color: #333333;
              }
              .email-body p {
                line-height: 1.6;
                margin-bottom: 20px;
              }
              .otp-code {
                display: inline-block;
                font-size: 28px;
                color: #4caf50;
                background: #f4f4f9;
                padding: 10px 20px;
                margin: 20px 0;
                border-radius: 8px;
                border: 1px dashed #4caf50;
                text-align: center;
              }
              .email-footer {
                text-align: center;
                background: #eeeeee;
                padding: 10px 20px;
                font-size: 12px;
                color: #777777;
              }
              .email-footer a {
                color: #4caf50;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <!-- Header -->
              <div class="email-header">
                <h1>Native Infotech</h1>
              </div>
              <!-- Body -->
              <div class="email-body">
                <p>Hi there,</p>
                <p>
                  Thank you for signing up! Use the code below to complete your
                  registration or verify your email address.
                </p>
                <div class="otp-code">${otp}</div>
                <p>
                  If you didn't request this code, please ignore this email or
                  contact support if you have concerns.
                </p>
              </div>
              <!-- Footer -->
              <div class="email-footer">
                <p>
                  Need help? <a href="mailto:sabhadiyajenish83@gmail.com">Contact Support</a>
                </p>
                <p>&copy; ${new Date().getFullYear()} Your App Name. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send OTP email.");
  }
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { sendOtpEmail, randomInt };

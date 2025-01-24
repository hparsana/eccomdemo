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

const sendForgotPasswordEmail = async (to, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your App Name" <${process.env.EMAIL_USER}>`, // Sender address
      to, // Recipient's email address
      subject: "Reset Your Password - OTP Code", // Subject line
      text: `Your OTP code for resetting your password is ${otp}.`, // Plain text body
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
                background: #ff9800;
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
                color: #ff9800;
                background: #f4f4f9;
                padding: 10px 20px;
                margin: 20px 0;
                border-radius: 8px;
                border: 1px dashed #ff9800;
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
                color: #ff9800;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <!-- Header -->
              <div class="email-header">
                <h1>Password Reset Request</h1>
              </div>
              <!-- Body -->
              <div class="email-body">
                <p>Hi there,</p>
                <p>
                  We received a request to reset your password. Use the code below to reset it:
                </p>
                <div class="otp-code">${otp}</div>
                <p>
                  If you didn't request a password reset, please ignore this email or contact support if you have concerns.
                </p>
              </div>
              <!-- Footer -->
              <div class="email-footer">
                <p>
                  Need help? <a href="mailto:sabhadiyajenish83@gmail.com">Contact Support</a>
                </p>
                <p>&copy; ${new Date().getFullYear()} ecommDemo. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Password reset email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email.");
  }
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const emailTemplates = {
  Pending: (user) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); overflow: hidden;">
      <div style="background: #ff9800; color: #fff; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Order Status: Pending</h1>
      </div>
      <div style="padding: 20px; color: #333;">
        <p style="font-size: 16px;">Hello <strong>${user}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6;">
          Your order is currently in the <strong>Pending</strong> stage. We are verifying your payment and preparing the necessary details for processing your order.
        </p>
        <p style="margin: 20px 0;">
          Please sit tight, and we’ll notify you once your order progresses to the next stage!
        </p>
        <a href="#" style="display: inline-block; background: #ff9800; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 14px; margin-top: 10px;">View Your Order</a>
      </div>
      <div style="background: #f9f9f9; padding: 10px; text-align: center; font-size: 12px; color: #777;">
        <p>&copy; ${new Date().getFullYear()} Ecomm Demo. All rights reserved.</p>
      </div>
    </div>
  `,
  Processing: (user) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); overflow: hidden;">
      <div style="background: #2196f3; color: #fff; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Order Status: Processing</h1>
      </div>
      <div style="padding: 20px; color: #333;">
        <p style="font-size: 16px;">Hello <strong>${user}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6;">
          Great news! Your order is now <strong>Processing</strong>. We are carefully packaging your items to ensure they arrive in perfect condition.
        </p>
        <p style="margin: 20px 0;">
          You can track the progress of your order by visiting your account.
        </p>
        <a href="#" style="display: inline-block; background: #2196f3; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 14px; margin-top: 10px;">Track Your Order</a>
      </div>
      <div style="background: #f9f9f9; padding: 10px; text-align: center; font-size: 12px; color: #777;">
        <p>&copy; ${new Date().getFullYear()} Ecomm Demo. All rights reserved.</p>
      </div>
    </div>
  `,
  Shipped: (user) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); overflow: hidden;">
      <div style="background: #4caf50; color: #fff; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Order Status: Shipped</h1>
      </div>
      <div style="padding: 20px; color: #333;">
        <p style="font-size: 16px;">Hello <strong>${user}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6;">
          Exciting news! Your order has been <strong>Shipped</strong> and is on its way to you. You can track your shipment to see its estimated delivery time.
        </p>
        <p style="margin: 20px 0;">
          Thank you for choosing us. We hope you enjoy your purchase!
        </p>
        <a href="#" style="display: inline-block; background: #4caf50; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 14px; margin-top: 10px;">Track Your Shipment</a>
      </div>
      <div style="background: #f9f9f9; padding: 10px; text-align: center; font-size: 12px; color: #777;">
        <p>&copy; ${new Date().getFullYear()} Ecomm Demo. All rights reserved.</p>
      </div>
    </div>
  `,
  Delivered: (user) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); overflow: hidden;">
      <div style="background: #673ab7; color: #fff; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Order Status: Delivered</h1>
      </div>
      <div style="padding: 20px; color: #333;">
        <p style="font-size: 16px;">Hello <strong>${user}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6;">
          Your order has been <strong>Delivered</strong>. We hope you are satisfied with your purchase. If you have any feedback or questions, please let us know.
        </p>
        <p style="margin: 20px 0;">
          Thank you for shopping with us. We look forward to serving you again!
        </p>
        <a href="#" style="display: inline-block; background: #673ab7; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 14px; margin-top: 10px;">Provide Feedback</a>
      </div>
      <div style="background: #f9f9f9; padding: 10px; text-align: center; font-size: 12px; color: #777;">
        <p>&copy; ${new Date().getFullYear()} Ecomm Demo. All rights reserved.</p>
      </div>
    </div>
  `,
  Cancelled: (user) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); overflow: hidden;">
      <div style="background: #f44336; color: #fff; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Order Status: Cancelled</h1>
      </div>
      <div style="padding: 20px; color: #333;">
        <p style="font-size: 16px;">Hello <strong>${user}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6;">
          We regret to inform you that your order has been <strong>Cancelled</strong>. If you have any questions, feel free to reach out to our support team.
        </p>
        <p style="margin: 20px 0;">
          We apologize for any inconvenience caused.
        </p>
        <a href="#" style="display: inline-block; background: #f44336; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 14px; margin-top: 10px;">Contact Support</a>
      </div>
      <div style="background: #f9f9f9; padding: 10px; text-align: center; font-size: 12px; color: #777;">
        <p>&copy; ${new Date().getFullYear()} Ecomm Demo. All rights reserved.</p>
      </div>
    </div>
  `,
};

const sendOrderStatusEmail = async (email, userName, status) => {
  const template = emailTemplates[status];

  if (!template) {
    console.error(`No email template found for status: ${status}`);
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"Ecomm Demo" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Order Status Update: ${status}`,
      text: template(userName), // Plain text email
      html: `
        <html>
          <body>
            <p>${template(userName)}</p>
          </body>
        </html>
      `,
    });

    console.log(`Email sent for status: ${status}`);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new ApiError(500, "Failed to send status email.");
  }
};
const sendNewOrderEmail = async (email, userName, order) => {
  try {
    await transporter.sendMail({
      from: `"Ecomm Demo" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Order Confirmation - Order #${order._id}`,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; background: #f4f4f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px;">
              <h2 style="color: #4caf50;">Thank You for Your Order, ${userName}!</h2>
              <p>Your order has been placed successfully.</p>
              <h3>Order Details:</h3>
              <p><strong>Order ID:</strong> ${order._id}</p>
              <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
              <p><strong>Payment Status:</strong> ${order.paymentDetails.status}</p>

            <h3 style="margin-bottom: 10px; font-size: 18px; color: #333;">Order Items:</h3>
<table style="width: 100%; border-collapse: collapse; margin-top: 10px; border: 1px solid #ddd;">
  <thead>
    <tr style="background: #f4f4f4; text-align: left; font-size: 16px;">
      <th style="padding: 10px; border: 1px solid #ddd;">Product</th>
      <th style="padding: 10px; border: 1px solid #ddd;">Image</th>
      <th style="padding: 10px; border: 1px solid #ddd;">Color</th>
      <th style="padding: 10px; border: 1px solid #ddd;">Quantity</th>
      <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
    </tr>
  </thead>
  <tbody>
    ${order.items
      .map((item) => {
        const product = item.product || {}; // Ensure product exists

        return `
        <tr style="border-bottom: 1px solid #ddd; font-size: 14px;">
          <td style="padding: 10px; border: 1px solid #ddd;">${product?.name || "Unknown Product"}</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
            <img src="${product?.images[0]?.url || "https://via.placeholder.com/50"}" 
                 alt="${product?.name || "No Image"}" 
                 width="50" height="50" 
                 style="border-radius: 5px;">
          </td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.color || "N/A"}</td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">$${item.price.toFixed(2)}</td>
        </tr>
      `;
      })
      .join("")}
  </tbody>
</table>



              <h3>Shipping Address:</h3>
              <p>${order.shippingDetails.address}, ${order.shippingDetails.city}, ${order.shippingDetails.state}, ${order.shippingDetails.country} - ${order.shippingDetails.postalCode}</p>
              
              <p style="margin-top: 20px;">Thank you for shopping with us!</p>
            </div>
          </body>
        </html>
      `,
    });

    console.log(`Order confirmation email sent to: ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    throw new Error("Failed to send order confirmation email.");
  }
};

export {
  sendOtpEmail,
  randomInt,
  sendForgotPasswordEmail,
  sendOrderStatusEmail,
  sendNewOrderEmail,
};

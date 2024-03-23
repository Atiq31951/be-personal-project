import jwt from "jsonwebtoken";
import dotEnv from "dotenv";

dotEnv.config();

const JWT_EXPIRATION = process.env.JWT_EXPIRATION; // Token expires in 1 hour
const RESET_TOKEN_EXPIRATION = process.env.RESET_TOKEN_EXPIRATION; // Reset token expires in 1 hour
const JWT_SECRET = process.env.JWT_SECRET;
const RESET_TOKEN_SECRET = process.env.RESET_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION;

const EMAIL_SERVICE = process.env.EMAIL_SERVICE;
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

// Function to generate JWT token
const generateAccessToken = (user) => {
  return (
    "Bearer - " +
    jwt.sign({ user }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
  );
};

// Function to generate reset token
const generateResetToken = (userId) => {
  return jwt.sign({ userId }, RESET_TOKEN_SECRET, {
    expiresIn: RESET_TOKEN_EXPIRATION,
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });
};

// Function to send password reset email
const sendResetEmail = async (email, resetToken) => {
  const transporter = nodemailer.createTransport({
    // Specify your email service and credentials
    service: "your_email_service",
    auth: {
      user: "your_email_address",
      pass: "your_email_password",
    },
  });

  const mailOptions = {
    from: "your_email_address",
    to: email,
    subject: "Password Reset",
    html: `<p>Please click the following link to reset your password:</p>
               <p><a href="http://your_domain/reset-password?token=${resetToken}">Reset Password</a></p>`,
  };

  await transporter.sendMail(mailOptions);
};

export {
  generateAccessToken,
  generateResetToken,
  generateRefreshToken,
  sendResetEmail,
};

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import User from "../models/User.js";
import { generateAccessToken } from "../utils/authUtils.js";

const JWT_SECRET = process.env.JWT_SECRET;
const RESET_TOKEN_SECRET = process.env.RESET_TOKEN_SECRET;

// Controller functions
const authController = {
  // User registration
  register: async (req, res) => {
    try {
      const { email, password, ...rest } = req.body;

      // Check if user already exists
      let user = await User.findOne({ email, account: rest.account });

      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      user = new User({
        ...rest,
        password: hashedPassword,
        email,
        is_active: true,
      });

      await user.save();

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Registration failed", error });
    }
  },

  // User login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (!user.is_active) {
        return res
          .status(401)
          .json({ message: "User is not active, please contatct admin", user });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate tokens
      const authenticatedUser = {
        id: user._id,
        email: user.email,
        account: user.account,
        name: user.name,
        role: user.role,
      };

      const accessToken = generateAccessToken(authenticatedUser);

      res.json({
        access_token: accessToken,
        user: authenticatedUser,
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed", error });
    }
  },

  // Forgot password
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate reset token
      const resetToken = generateResetToken(user._id);

      // Send reset password email
      await sendResetEmail(email, resetToken);

      res.json({ message: "Reset password email sent successfully" });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Forgot password failed" });
    }
  },

  // Reset password
  resetPassword: async (req, res) => {
    try {
      const { token, password } = req.body;

      // Verify reset token
      const decodedToken = jwt.verify(token, RESET_TOKEN_SECRET);
      if (!decodedToken) {
        return res.status(403).json({ message: "Invalid reset token" });
      }

      // Find user by token
      const user = await User.findById(decodedToken.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update user password
      user.password = hashedPassword;
      await user.save();

      res.json({ message: "Password reset successful" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Reset password failed" });
    }
  },

  // Update password
  updatePassword: async (req, res) => {
    try {
      const { userId } = req.user; // Extract user ID from the authenticated request
      const { oldPassword, newPassword } = req.body;

      // Find user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the old password matches the stored password
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid old password" });
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update user's password
      user.password = hashedNewPassword;
      await user.save();

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Update password error:", error);
      res.status(500).json({ message: "Update password failed" });
    }
  },

  // Middleware to verify JWT token
  authenticateToken: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Token expired or invalid", err });
      }

      req.user = user;
      next();
    });
  },
};

export default authController;

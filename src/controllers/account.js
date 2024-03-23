import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import User from "../models/User.js";
import { generateAccessToken } from "../utils/authUtils.js";

const JWT_SECRET = process.env.JWT_SECRET;
const RESET_TOKEN_SECRET = process.env.RESET_TOKEN_SECRET;

// Controller functions
const accountController = {
  create: async (req, res) => {
    const { email, password,...rest } = req.body;
  }
};

export default accountController;

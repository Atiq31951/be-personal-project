// middleware/auth.js
import jwt from "jsonwebtoken";

import User from "../models/User.js";

export const authenticateUser = async (req, res, next) => {
  // Get token from request headers
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  try {
    // Verify token
    const {
      user: { email },
    } = jwt.verify(token, process.env.JWT_SECRET);


    const user = await User.findOne({ email });
    
    // Attach user data to request object
    req.user = decoded.user;

    // Continue to next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", error });
  }
};

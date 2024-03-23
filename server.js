// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotEnv from "dotenv"; // Load environment variables from .env file
import errorHandler from "express-error-handler";
import winston from "winston"; // Consider using only one logger.

import routes from "./src/routes/index.js"; // Assuming your routes are in a separate file

// // making ENV file attribute available
dotEnv.config();

// // Configure CORS middleware
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000", // Replace with your allowed origin(s)
  credentials: true, // Allow cookies for cross-origin requests (if applicable)
  optionsSuccessStatus: 200, // Respond with 200 for preflight requests
};

const app = express();

// app.use(winston(corsOptions));

app.use(cors(corsOptions));

app.use(express.json()); // Example middleware for parsing JSON bodies

app.use("/api", routes); // Mount routes under '/api' prefix (optional)

// // Apply error handling middleware as the last app.use()
app.use(errorHandler());

// // Connect to MongoDB and start server
const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected ...");
    app.listen(PORT);
  })
  .then(() => {
    console.log(`Server is running on port ${PORT} ...`);
  })
  .catch((err) => console.error("MongoDB connection error:", err));

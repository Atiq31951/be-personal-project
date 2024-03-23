import express from "express";
const routes = express.Router();

// Import individual route files
import authRoutes from "./auth.js";
// const userRoutes = require("./user");
// const accountRoutes = require("./account");
// const customerRoutes = require("./customer");
// const productRoutes = require("./product");
// const paymentRoutes = require("./payment");

// Mount routes onto the main router
routes.use("/auth", authRoutes);
// routes.use("/users", userRoutes);
// routes.use("/accounts", accountRoutes);
// routes.use("/customers", customerRoutes);
// routes.use("/products", productRoutes);
// routes.use("/payments", paymentRoutes);

export default routes;

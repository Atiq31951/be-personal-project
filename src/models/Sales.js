import mongoose from "mongoose";

// Define the schema for the Payment model
const saleSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer", // Reference to the Customer model
    required: true,
  },
  status: {
    type: String,
    enum: ["partial", "full", "pending"],
    default: "pending",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the user who created this payment
    ref: "User",
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      sale_price: {
        type: Number,
        required: true,
      },
      sale_unit: {
        type: String,
        required: true,
      },
    },
  ],
  total_amount: {
    type: Number,
    required: true,
  },
  paid_amount: {
    type: Number,
    default: 0,
  },
});

// Utility functions for the customer schema
saleSchema.statics.findBySearch = async function ({
  search,
  account,
  page = 1,
  limit = 10,
}) {
  // Use regular expression for partial match (case-insensitive)
  const regex = new RegExp(search, "i");

  // Build the query based on search criteria and optional category
  const query = {
    $and: [
      {
        name: { $regex: regex },
      },
      { account },
    ],
  };

  // Count the total number of matching documents (without pagination)
  const total = await this.countDocuments(query);

  const options = {
    // Skip (page - 1) * limit documents to implement pagination
    skip: (page - 1) * limit,
    limit: limit,
  };

  // Find paginated results based on the query and options
  const results = await this.find(query, options);

  return {
    total,
    results,
  };
};

// Create the Payment model from the schema
const Payment = mongoose.model("Sale", saleSchema);

export default Payment;

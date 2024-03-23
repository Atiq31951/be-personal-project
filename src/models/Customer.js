import mongoose from "mongoose";

// Define the schema for the Customer model
const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // Allows null values to be stored for uniqueness constraint
    },
    phone_number: {
      type: String,
      required: true,
      unique: true,
    },
    photos: {
      type: [String], // Array of strings representing photo URLs
      default: [],
    },
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment", // Reference to the Payment model
      },
    ],
    total_buy: {
      type: Number,
      default: 0,
    },
    total_paid: {
      type: Number,
      default: 0,
    },
    total_pending_payment: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
      required: true,
    },
    shop_name: {
      type: String,
      required: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account", // Reference to the Account model
      required: true,
    },
  },
  { timestamps: true }
);

// Utility functions for the customer schema
customerSchema.statics.findBySearch = async function ({
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
        $or: [
          { name: { $regex: regex } },
          { category: { $regex: regex } }, // Match category if provided
        ],
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

// Create the Customer model from the schema
const Customer = mongoose.model("Customer", customerSchema);

export default Customer;

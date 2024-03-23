import mongoose from "mongoose";

// Define the schema for the Customer model
const accountSchema = new mongoose.Schema(
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
    address: {
      type: String,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
      },
    ],
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    suppliers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
      },
    ],
    created_by: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the user who created this user,
      ref: "User",
    },
    total_due_to_customers: {
      type: Number,
      default: 0,
    },
    total_due_to_suppliers: {
      type: Number,
      default: 0,
    },
    total_due_to_distributors: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Utility functions for the customer schema
accountSchema.statics.findByAny = async function (
  searchString,
  page = 1,
  limit = 10
) {
  // Use regular expression for partial match (case-insensitive)
  const regex = new RegExp(searchString, "i");

  // Count the total number of matching documents (without pagination)
  const total = await this.countDocuments({
    $or: [
      { name: { $regex: regex } },
      { email: { $regex: regex } },
      { phone_number: { $regex: regex } },
      { address: { $regex: regex } },
    ],
  });

  const options = {
    // Skip (page - 1) * limit documents to implement pagination
    skip: (page - 1) * limit,
    limit: limit,
  };

  // Find paginated results based on search criteria and options
  const results = await this.find(
    {
      $or: [
        { name: { $regex: regex } },
        { email: { $regex: regex } },
        { phone_number: { $regex: regex } },
        { address: { $regex: regex } },
      ],
    },
    options
  );

  return {
    total,
    results,
  };
};

// Create the Customer model from the schema
const Customer = mongoose.model("Account", accountSchema);

export default Customer;

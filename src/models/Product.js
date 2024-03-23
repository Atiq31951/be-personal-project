import mongoose from "mongoose";

// Define the schema for the Product model
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: String,
  description: String,
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Category model,
    ref: "Category",
  },
  quantity: {
    type: Number,
    default: 0,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Account model
    ref: "Account",
  },
});

// Utility functions for the Product schema
productSchema.statics.findBySearch = async function ({
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
          { brand: { $regex: regex } },
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

// Create the Product model from the schema
const Product = mongoose.model("Product", productSchema);

export default Product;

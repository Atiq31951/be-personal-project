import mongoose from "mongoose";

// Define the schema for the Category model
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure category names are unique
  },
  description: String,
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Optional reference to a parent category (for hierarchical categories)
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the user who created this category
    ref: "User",
  },
  account: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Account model
    ref: "Account",
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

// Utility functions for the customer schema
categorySchema.statics.findBySearch = async function ({
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

// Create the Category model from the schema
const Category = mongoose.model("Category", categorySchema);

export default Category;

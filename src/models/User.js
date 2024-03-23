import mongoose from "mongoose";

// Define the schema for the User model
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    photos: {
      type: [String], // Array of strings representing photo URLs
      default: [],
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [
        "super_admin",
        "super_powered_admin",
        "inventory_manager",
        "distributor",
        "customer",
      ],
      required: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Account model
      ref: "Account",
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the user who created this user
      ref: "User",
    },
    password: {
      type: String,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

// Define any additional methods or statics for the user schema
userSchema.methods = {
  // Method to create a new user with lower role
  async createNewUser(newUserAttributes) {
    // Ensure that the new user's role is lower than the current user's role
    if (roleHierarchy[newUserAttributes.role] > roleHierarchy[this.role]) {
      throw new Error("Cannot create a user with higher role.");
    }

    // Check if the email already exists within the account
    const existingUserWithEmail = await this.model("User").findOne({
      email: newUserAttributes.email,
      account: this.account,
    });

    if (existingUserWithEmail) {
      throw new Error(
        "User with this email already exists within the account."
      );
    }

    // Set the parent user to be the current user
    newUserAttributes.created_by = this._id;

    // Create and return the new user
    return await this.model("User").create(newUserAttributes);
  },
};

// Create the User model from the schema
const User = mongoose.model("User", userSchema);

// Role hierarchy for comparing roles
const roleHierarchy = {
  super_admin: 0,
  super_powered_admin: 1,
  inventory_manager: 2,
  distributor: 3,
  customer: 4,
};

export default User;

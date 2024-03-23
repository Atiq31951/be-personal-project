// controllers/userController.js
import User from "../models/User.js";

const userController = {
  // Create a new user
  async createUser(req, res) {
    try {
      const { name, email, phone_number, address, shop_name, role, account } =
        req.body;

      // Validate request body
      if (
        !name ||
        !email ||
        !phone_number ||
        !address ||
        !shop_name ||
        !role ||
        !account
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check if the user role is valid
      const validRoles = [
        "superAdmin",
        "superPoweredAdmin",
        "inventoryManager",
        "distributor",
        "customer",
      ];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid user role" });
      }

      // Check if the account exists
      // You can add additional validation as per your requirements
      // For example, ensuring that the account ID is valid and exists in the database
      // For simplicity, we assume the account exists for now

      const newUser = new User({
        name,
        email,
        phone_number,
        address,
        shop_name,
        role,
        account,
      });

      await newUser.save();

      return res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // Get user by ID
  async getUserById(req, res) {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // Update user by ID
  async updateUserById(req, res) {
    try {
      const userId = req.params.id;
      const updates = req.body;
      const updatedUser = await User.findByIdAndUpdate(userId, updates, {
        new: true,
      });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // Delete user by ID
  async deleteUserById(req, res) {
    try {
      const userId = req.params.id;
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // Other user controller methods...
};

export default userController;

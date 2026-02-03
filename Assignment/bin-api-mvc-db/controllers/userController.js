const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// Get all users
async function getAllUsers(req, res) {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving users" });
  }
}

// Get user by ID
async function getUserById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const user = await User.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving user" });
  }
}

// Create new user
async function registerUser(req, res) {
  const { Name, EmailAddr, Status, DateJoined, Password } = req.body;

  try { 
    // Check for existing username
    const existingUser = await User.getUserByUsername(Name);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    // Create user in database
    const userData = {
      Name: Name,
      EmailAddr: EmailAddr,
      Status: Status,
      DateJoined: DateJoined,
      PasswordHash: hashedPassword,
    };
    const newUser = await User.createUser(userData);
    return res.status(201).json({ message: "User created successfully", 
                                  data: newUser,
                                });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Update existing user
async function updateUser(req, res) {
  try {
    const id = parseInt(req.params.id);
    const result = await User.updateUser(id, req.body);
    if (result === 0) {
      return res.status(404).send("User not found");
    }
    const updatedUser = await User.getUserById(id);
    res.json({
      message: `User with id ${id} updated successfully.`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error updating user" });
  }
}

// Delete existing user
async function deleteUser(req, res) {
  try {
    const id = parseInt(req.params.id);
    const result = await User.deleteUser(id);
    if (result === 0) {
      return res.status(404).send("User not found");
    }
    res.json({
      message: `User with id ${id} deleted successfully.`
    });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
}

async function searchUsers(req, res) {
  const searchTerm = req.query.searchTerm; // Extract search term from query params

  if (!searchTerm) {
    return res.status(400).json({ message: "Search term is required" });
  }

  try {
    const users = await User.searchUsers(searchTerm);
    res.json(users);
  } catch (error) {
    console.error("Controller error in searchUsers:", error);
    res.status(500).json({ message: "Error searching users" });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  registerUser,
  updateUser,
  deleteUser,
  searchUsers,
};
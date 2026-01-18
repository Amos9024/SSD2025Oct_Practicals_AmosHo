const { user } = require("../dbConfig");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

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
/* async function createUser(req, res) {
  try {
    const newUser = await User.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error creating user" });
  }
} */

async function registerUser(req, res) {
  const { username, password, email, role } = req.body;

  try {
    // Validate user data
    // ... Implement your validation logic here or better yet write a middleware function for your validation...

    // Check for existing username
    const existingUser = await User.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in database
    // ... your database logic here ...
    const userData = {
      username: username,
      email: email,
      passwordHash: hashedPassword,
      role: role,
    };
    const newUser = await User.createUser(userData);

    return res.status(201).json({ message: "User created successfully", data: newUser });
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

async function getUsersWithBooks(req, res) {
  try {
    const users = await User.getUsersWithBooks();
    res.json(users);
  } catch (error) {
    console.error("Controller error in getUsersWithBooks:", error);
    res.status(500).json({ message: "Error fetching users with books" });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  //createUser,
  updateUser,
  deleteUser,
  searchUsers,
  getUsersWithBooks,
  registerUser,
};
const bookModel = require("../models/userModel");

// Get all users
async function getAllUsers(req, res) {
  try {
    const users = await bookModel.getAllUsers();
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
    const user = await bookModel.getUserById(id);
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
async function createUser(req, res) {
  try {
    const newUser = await bookModel.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error creating user" });
  }
}

// Update an existing user
async function updateUser(req, res) {
  try {
    const id = parseInt(req.params.id);
    const updatedUser = await bookModel.updateUser(id, req.body);
    if (updatedUser === 0) {
      return res.status(404).json({ message: `No user found with id ${id}.` });
    }
    res.status(200).json({ message: "User updated successfully." });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error updating user" });
  }
}

// Delete a user
async function deleteUser(req, res) {
  try {   
    const id = parseInt(req.params.id);
    const message = await bookModel.deleteUser(id);
    if (message === 0) {
      return res.status(404).json({ message: `No user found with id ${id}.` });
    }
    res.json({message: `User with id ${id} deleted successfully.`});
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
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
  getUsersWithBooks,
};
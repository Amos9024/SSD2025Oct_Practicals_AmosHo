const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json"); // Import generated spec

const path = require("path");
const express = require("express");
const sql = require("mssql");
const dotenv = require("dotenv");
// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const port = process.env.PORT || 3000;
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// --- Serve static files from the 'public' directory ---
// When a request comes in for a static file (like /index.html, /styles.css, /script.js),
// Express will look for it in the 'public' folder relative to the project root.
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// import Book Validation Middleware
const {
  validateBook,
  validateBookId,
} = require("./middlewares/bookValidation"); 

// Import User Validation Middleware
const {
  validateUser,
  validateUserId,
  validatePassword,
  validateRole,
} = require("./middlewares/userValidation"); 

// Import User Authorization Middleware
const authorizeUser = require("./middlewares/authorizeUser");

// Import Controllers
const authController = require("./controllers/authController");
const userController = require("./controllers/userController"); // Note: Changed to userController for consistency
const bookController = require("./controllers/bookController");

// Link specific URL paths to the corresponding controller functions

// Routes for books
app.get("/books", authorizeUser, bookController.getAllBooks);
app.get("/books/:id", authorizeUser, validateBookId, bookController.getBookById);
//app.get("/books/:id", validateBookId, bookController.getBookById);
app.post("/books", authorizeUser, validateBook, bookController.createBook);
app.put("/books/:bookId/availability", authorizeUser, bookController.updateBookAvailability);
app.put("/books/:id", authorizeUser, validateBookId, validateBook, bookController.updateBook);
app.delete("/books/:id", authorizeUser, validateBookId, bookController.deleteBook);

// Routes for users
app.post("/register", validateUser, validatePassword, validateRole, userController.registerUser); // Create user
app.get("/users", userController.getAllUsers); // Get all users
// Order is important: place search route before getUserById
app.get("/users/search", userController.searchUsers); // Search users
app.get("/users/with-books", userController.getUsersWithBooks);
app.get("/users/:id", userController.getUserById); // Get user by ID
app.put("/users/:id", userController.updateUser); // Update user
app.delete("/users/:id", userController.deleteUser); // Delete user

// Routes for Authentication controller
app.post("/login", authController.login); // Login user

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
// Listen for termination signals (like Ctrl+C)
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Close any open connections
  await sql.close();
  console.log("Database connections closed");
  process.exit(0); // Exit the process
});
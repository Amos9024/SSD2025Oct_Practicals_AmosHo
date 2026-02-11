const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json"); // Import generated spec

const express = require("express");
const sql = require("mssql");
const dotenv = require("dotenv");
// Load environment variables
dotenv.config();


const { validateBin, validateBinId,} = require("./middlewares/binValidation"); // import Bin Validation Middleware
// Import User Validation Middleware
const {validateUser, validateUserId, validatePassword, validateRole,validateDateJoined} = require("./middlewares/userValidation"); 
const authorizeUser = require("./middlewares/authorizeUser");
const {validateRequest, validateRequestId} = require("./middlewares/reqValidation");
const binController = require("./controllers/binController");
const userController = require("./controllers/userController");
const reqcontroller = require("./controllers/reqController");
const authController = require("./controllers/authController");


// Create Express app
const app = express();
const port = process.env.PORT || 3000;
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware (Parsing request bodies)
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

app.get("/bins", authorizeUser, binController.getAllBins);
app.get("/bins/:id", authorizeUser, validateBinId, binController.getBinById);
app.post("/bins", authorizeUser, validateBin, binController.createBin); 
app.put("/bins/:id/availability", authorizeUser, validateBinId, binController.updateBinAvailability);
app.put("/bins/:id", authorizeUser, validateBin, validateBinId, binController.updateBin);
app.delete("/bins/:id", authorizeUser, validateBinId, binController.deleteBin);

// Routes for users
app.post("/register", validateUser, validateRole, validateDateJoined, validatePassword, userController.registerUser); // Create user
app.get("/users", userController.getAllUsers); // Get all users
// Order is important: place search route before getUserById
app.get("/users/search", userController.searchUsers); // Search users
app.get("/users/:id",validateUserId,userController.getUserById); // Get user by ID
app.put("/users/:id",validateUserId,  userController.updateUser); // Update user
app.delete("/users/:id", validateUserId,userController.deleteUser); // Delete user

app.get("/requests", reqcontroller.getAllRequests);
app.get("/requests/:id",validateRequestId, reqcontroller.getRequestById);
app.post("/requests", reqcontroller.createRequest);
app.put("/requests/:id", validateRequestId,reqcontroller.updateRequest);
app.delete("/requests/:id", validateRequestId, reqcontroller.deleteRequest);


app.post("/login", authController.login);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  await sql.close();
  console.log("Database connections closed");
  process.exit(0);
});
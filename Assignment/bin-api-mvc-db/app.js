const express = require("express");
const sql = require("mssql");
const dotenv = require("dotenv");
// Load environment variables
dotenv.config();

const binController = require("./controllers/binController");
const { validateBin, validateBinId,} = require("./middlewares/binValidation"); // import Bin Validation Middleware


// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware (Parsing request bodies)
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

app.get("/bins", binController.getAllBins);
app.get("/bins/:id", validateBinId, binController.getBinById);
app.post("/bins", validateBin, binController.createBin); 
app.put("/bins/:id", validateBin, validateBinId, binController.updateBin);
app.delete("/bins/:id", validateBinId, binController.deleteBin);


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
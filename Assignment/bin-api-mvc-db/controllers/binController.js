const binModel = require("../models/binModel");

// Get all bins
async function getAllBins(req, res) {
  try {
    const bins = await binModel.getAllBins();
    res.json(bins);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving bins" });
  }
}

// Get bin by ID
async function getBinById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const bin = await binModel.getBinById(id);
    if (!bin) {
      return res.status(404).json({ error: "Bin not found" });
    }

    res.json(bin);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving bin" });
  }
}

// Create new bin
async function createBin(req, res) {
  try {
    const newBin = await binModel.createBin(req.body);
    res.status(201).json(newBin);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error creating bin" });
  }
}

// Update an existing bin
async function updateBin(req, res) {
  try {
    const id = parseInt(req.params.id);
    const updatedBin = await binModel.updateBin(id, req.body);
    if (updatedBin === 0) {
      return res.status(404).json({ message: `No bin found with id ${id}.` });
    }
    res.status(200).json({ message: "Bin updated successfully." });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error updating bin" });
  }
}

// Delete a bin
async function deleteBin(req, res) {
  try {   
    const id = parseInt(req.params.id);
    const message = await binModel.deleteBin(id);
    if (message === 0) {
      return res.status(404).json({ message: `No bin found with id ${id}.` });
    }
    res.json({message: `Bin with id ${id} deleted successfully.`});
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error deleting bin" });
  }
}
module.exports = {
  getAllBins,
  getBinById,
  createBin,
  updateBin,
  deleteBin,
};
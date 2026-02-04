const reqModel = require("../models/diskRequestModel");

// Get all requests
async function getAllRequests(req, res) {
  try {
    const requests = await reqModel.getAllRequests();
    res.json(requests);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving requests" });
  }
}

// Get request by ID
async function getRequestById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const request = await reqModel.getRequestById(id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.json(request);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving request" });
  }
}

// Create new request
async function createRequest(req, res) {
  try {
    const newRequest = await reqModel.createRequest(req.body);
    res.status(201).json(newRequest);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error creating request" });
  }
}

// Update an existing request
async function updateRequest(req, res) {
  try {
    const id = parseInt(req.params.id);
    const updatedRequest = await reqModel.updateRequest(id, req.body);
    if (updatedRequest === 0) {
      return res.status(404).json({ message: `No request found with id ${id}.` });
    }
    res.status(200).json({ message: "Request updated successfully." });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error updating bin" });
  }
}

// Delete a request
async function deleteRequest(req, res) {
  try {   
    const id = parseInt(req.params.id);
    const message = await reqModel.deleteRequest(id);
    if (message === 0) {
      return res.status(404).json({ message: `No request found with id ${id}.` });
    }
    res.json({message: `Request with id ${id} deleted successfully.`});
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error deleting request" });
  }
}

module.exports = {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
};
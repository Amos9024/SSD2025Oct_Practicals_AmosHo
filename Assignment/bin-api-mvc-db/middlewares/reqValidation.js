const Joi = require("joi"); // Import Joi for validation

// Validation schema for requests (used for POST/PUT)
const requestSchema = Joi.object({
  
  Weight: Joi.number().integer().min(1).max(10).required().messages({
    "number.base": "Weight must be a number",
    "number.integer": "Weight must be an integer",
    "number.min": "Weight must be at least 1",
    "number.max": "Weight cannot exceed 10",
    "any.required": "Weight is required",
  }),

  SerialNumber: Joi.number().integer().min(1).required().messages({
    "number.base": "SerialNumber must be a number",
    "number.integer": "SerialNumber must be an integer",
    "number.min": "SerialNumber must be greater than 0",
    "any.required": "SerialNumber is required",
  }),

  ModelName: Joi.string().min(1).max(50).required.messages({
    "string.base": "ModelName must be a string",
    "string.min": "ModelName must be at least 1 character",
    "string.max": "ModelName cannot exceed 50 characters",
    "any.required": "ModelName is required",
  }),

  
});

// Middleware to validate bin data (for POST/PUT)
function validateRequest(req, res, next) {
  // Validate the request body against the requestSchema
  const { error } = requestSchema.validate(req.body, { abortEarly: false }); // abortEarly: false collects all errors

  if (error) {
    // If validation fails, format the error messages and send a 400 response
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(400).json({ error: errorMessage });
  }

  // If validation succeeds, pass control to the next middleware/route handler
  next();
}

// Middleware to validate request ID from URL parameters (for GET by ID, PUT, DELETE)
function validateRequestId(req, res, next) {
  // Parse the ID from request parameters
  const id = parseInt(req.params.id);

  // Check if the parsed ID is a valid positive number
  if (isNaN(id) || id <= 0) {
    // If not valid, send a 400 response
    return res
      .status(400)
      .json({ error: "Invalid bin ID. ID must be a positive number" });
  }

  // If validation succeeds, pass control to the next middleware/route handler
  next();
}

module.exports = {
  validateRequest,
  validateRequestId,
};
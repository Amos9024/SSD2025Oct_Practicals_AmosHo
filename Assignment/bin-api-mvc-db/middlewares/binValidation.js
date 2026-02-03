const Joi = require("joi"); // Import Joi for validation

// Validation schema for bins (used for POST/PUT)
const binSchema = Joi.object({
  /* BinID: Joi.number().integer().min(1).required().messages({
    "number.base": "BinID must be a number",
    "number.integer": "BinID must be an integer",
    "number.min": "BinID must be greater than 0",
    "any.required": "BinID is required",
  }), */

  LocationID: Joi.string().min(1).max(50).required().messages({
    "string.base": "LocationID must be a string",
    "string.empty": "LocationID cannot be empty",
    "string.min": "LocationID must be at least 1 character long",
    "string.max": "LocationID cannot exceed 50 characters",
    "any.required": "LocationID is required",
  }),

  currentCapacity: Joi.number().integer().min(0).default(0).messages({
    "number.base": "CurrentCapacity must be a number",
    "number.integer": "CurrentCapacity must be an integer",
    "number.min": "CurrentCapacity cannot be negative",
    
  }),

  MaxCapacity: Joi.number().integer().min(1).required().messages({
    "number.base": "MaxCapacity must be a number",
    "number.integer": "MaxCapacity must be an integer",
    "number.min": "MaxCapacity must be greater than 0",
    "any.required": "MaxCapacity is required",
  }),

  Country: Joi.string().min(1).max(50).allow(null, "").messages({
    "string.base": "Country must be a string",
    "string.min": "Country must be at least 1 character",
    "string.max": "Country cannot exceed 50 characters",
  }),

  BinStatus: Joi.string().length(1).valid("A", "N").required().messages({
    "string.base": "BinStatus must be a string",
    "string.length": "BinStatus must be a single character",
    "any.only": "BinStatus must be either 'A' (Active) or 'N' (Not Active)",
    "any.required": "BinStatus is required",
  }),
  
});

// Middleware to validate bin data (for POST/PUT)
function validateBin(req, res, next) {
  // Validate the request body against the binSchema
  const { error } = binSchema.validate(req.body, { abortEarly: false }); // abortEarly: false collects all errors

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

// Middleware to validate bin ID from URL parameters (for GET by ID, PUT, DELETE)
function validateBinId(req, res, next) {
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
  validateBin,
  validateBinId,
};
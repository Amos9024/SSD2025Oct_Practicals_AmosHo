const Joi = require("joi"); // Import Joi for validation

// Validation schema for users (used for POST/PUT)
const userSchema = Joi.object({
  username: Joi.string().min(1).max(50).required().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username cannot be empty",
    "string.min": "Username must be at least 1 character long",
    "string.max": "Username cannot exceed 50 characters",
    "any.required": "Username is required",
  }),
  email: Joi.string().min(1).max(50).required().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email cannot be empty",
    "string.min": "Email must be at least 1 character long",
    "string.max": "Email cannot exceed 100 characters",
    "any.required": "Email is required",
  }),
  // Add validation for other fields if necessary (e.g., year, genre)
}).unknown(true); // Allow additional fields in the request body

// Middleware to validate user data (for POST/PUT)
function validateUser(req, res, next) {
  // Validate the request body against the userSchema
  const { error } = userSchema.validate(req.body, { abortEarly: false }); // abortEarly: false collects all errors

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

// Middleware to validate user ID from URL parameters (for GET by ID, PUT, DELETE)
function validateUserId(req, res, next) {
  // Parse the ID from request parameters
  const id = parseInt(req.params.id);

  // Check if the parsed ID is a valid positive number
  if (isNaN(id) || id <= 0) {
    // If not valid, send a 400 response
    return res
      .status(400)
      .json({ error: "Invalid user ID. ID must be a positive number" });
  }

  // If validation succeeds, pass control to the next middleware/route handler
  next();
}

function validatePassword(req, res, next) {
  // Get password from request body
  const password = req.body.password;
  /* if (!password || password.trim() === "") {
    return res.status(400)
              .json({error: "Password is required"});
  } else if (password.length < 8) {
    return res.status(400)
              .json({error: "Password must be at least 8 characters long"});
  } */
  //Check is password contains at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character
  /* Breakdown of the regex:
      ^: Asserts the start of the string.
      (?=.*[A-Z]): Positive lookahead ensuring at least one uppercase letter (A-Z) is present anywhere in the string.
      (?=.*[a-z]): Positive lookahead ensuring at least one lowercase letter (a-z) is present anywhere in the string.
      (?=.*\d): Positive lookahead ensuring at least one digit (0-9) is present anywhere in the string.
      (?=.*[!@#$%^&*()_+]): Positive lookahead ensuring at least one of the specified special characters is present anywhere in the string. You can modify the characters within the square brackets [] to include or exclude specific special characters.
      [A-Za-z\d!@#$%^&*()_+]: Allows alphanumeric characters and the specified special characters.
      {8,}: Specifies a minimum length of 8 characters. You can add a maximum length, for example, {8,20} for 8 to 20 characters.
      $: Asserts the end of the string. */
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400)
              .json({error: 
                "Password must be at least 8 characters long, contains at least one uppercase letter, one lowercase letter, one number, and one special character"});
  }
  // If validation succeeds, pass control to the next middleware/route handler
  next();
}

function validateRole(req, res, next) {
  // Get role from request body, convert to lowercase and trim whitespace 
  const role = req.body.role.trim().toLowerCase();
  if (!role || role.trim() === "") {
    return res.status(400)
              .json({error: "Role is required"});
  }
  // Check if the role is valid
  validRoles = ['member', 'librarian'];
  if (!validRoles.includes(role)) {   
    return res.status(400)
              .json({error: "Role must be either of: " + validRoles.join(", ")});
  }
  
  // If validation succeeds, pass control to the next middleware/route handler
  next();
}

module.exports = {
  validateUser,
  validateUserId,
  validatePassword,
  validateRole,
};
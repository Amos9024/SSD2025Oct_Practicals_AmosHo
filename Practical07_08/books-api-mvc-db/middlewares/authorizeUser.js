// This middleware checks if the user is authorized to access certain routes
// It can check for roles, permissions, or any other criteria you define.
const jwt = require("jsonwebtoken");
function verifyJWT(req, res, next) {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Check user role for authorization
    const authorizedRoles = {
        // Anyone can view a list books
        "GET /books": ["member", "librarian"], 
        // Anyone can view a particular books
        "GET /books/[0-9]+": ["member", "librarian"], 
        // Only librarians can create books
        "POST /books": ["librarian"], 
        // Only librarians can update book availability
        "PUT /books/[0-9]+/availability": ["librarian"], 
        // Only librarians can update book details
        "PUT /books/[0-9]+": ["librarian"], 
        // Only librarians can delete books
        "DELETE /books/[0-9]+": ["librarian"], 
    };

    // const authorizedRoles = {
    //   // Anyone can view a list books
    //   "GET /books": ["member", "librarian"], 
    //   // Anyone can view a particular book
    //   "GET /books/\\d+": ["member", "librarian"], 
    //   // Only librarians can create books
    //   "POST /books": ["librarian"], 
    //   // Only librarians can update book availability
    //   "PUT /books/\\d+/availability": ["librarian"], 
    //   // Only librarians can update book details
    //   "PUT /books/\\d+": ["librarian"], 
    //   // Only librarians can delete books
    //   "DELETE /books/\\d+": ["librarian"], 
    // };
  
    //console.log(`Requested Endpoint: , ${req.method} ${req.url}`);
    //const requestedEndpoint = `${req.method} ${req.url}`; // Include method in endpoint
    const requestedEndpoint = `${req.method} ${req.url.split('?')[0]}`; // Remove query string
    const userRole = decoded.role;

    const authorizedRole = Object.entries(authorizedRoles).find(
      ([endpoint, roles]) => {
        const regex = new RegExp(`^${endpoint}$`); // Create RegExp from endpoint
        return regex.test(requestedEndpoint) && roles.includes(userRole);
      }
    );

    if (!authorizedRole) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = decoded; // Attach decoded user information to the request object
    next();
  });
}

module.exports = verifyJWT;
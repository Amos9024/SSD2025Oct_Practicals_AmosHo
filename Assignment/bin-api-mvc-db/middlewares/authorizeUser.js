const jwt = require("jsonwebtoken");
function verifyJWT(req, res, next) {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    console.log("Decoded JWT:", decoded);
    console.log("JWT Verification Error:", err);
    
    if (err) {
      return res.status(403).json({ message: "Forbidden1" });
    }

    // Check user role for authorization
    const authorizedRole = {
        // Anyone can view a list bins
        "GET /bins": ["member", "admin"], 
        // Anyone can view a particular bins
        "GET /bins/[0-9]+": ["member", "admin"], 
        // Only Active users can create bins
        "POST /bins": ["admin"], 
        // Only Active users can update bin availability
        "PUT /bins/[0-9]+/availability": [ "admin"], 
        // Only Active users can update bin details
        "PUT /bins/[0-9]+": ["admin"], 
        // Only Active users can delete bins
        "DELETE /bins/[0-9]+": ["admin"], 
    };
    //console.log(`Requested Endpoint: , ${req.method} ${req.url}`);
    //const requestedEndpoint = `${req.method} ${req.url}`; // Include method in endpoint
    const requestedEndpoint = `${req.method} ${req.url.split('?')[0]}`; // Remove query string
    const userRole = decoded.role;
    

    const authorizedR = Object.entries(authorizedRole).find(
      ([endpoint, roles]) => {
        const regex = new RegExp(`^${endpoint}$`); // Create RegExp from endpoint
        return regex.test(requestedEndpoint) && roles.includes(userRole);
      }
    );

    if (!authorizedR) {
      return res.status(403).json({ message: "Forbidden2" });
    }

    req.user = decoded; // Attach decoded user information to the request object
    next();
  });
}

module.exports = verifyJWT;
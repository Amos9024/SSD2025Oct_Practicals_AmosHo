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

    // Check user status for authorization
    const authorizedStatus = {
        // Anyone can view a list bins
        "GET /bins": ["A", "N"], 
        // Anyone can view a particular bins
        "GET /bins/[0-9]+": ["A", "N"], 
        // Only Active users can create bins
        "POST /bins": ["A"], 
        // Only Active users can update bin availability
        "PUT /bins/[0-9]+/availability": ["A"], 
        // Only Active users can update bin details
        "PUT /bins/[0-9]+": ["A"], 
        // Only Active users can delete bins
        "DELETE /bins/[0-9]+": ["A"], 
    };
    //console.log(`Requested Endpoint: , ${req.method} ${req.url}`);
    //const requestedEndpoint = `${req.method} ${req.url}`; // Include method in endpoint
    const requestedEndpoint = `${req.method} ${req.url.split('?')[0]}`; // Remove query string
    const userStatus = decoded.status;

    const authorizedS = Object.entries(authorizedStatus).find(
      ([endpoint, roles]) => {
        const regex = new RegExp(`^${endpoint}$`); // Create RegExp from endpoint
        return regex.test(requestedEndpoint) && roles.includes(userStatus);
      }
    );

    if (!authorizedS) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = decoded; // Attach decoded user information to the request object
    next();
  });
}

module.exports = verifyJWT;
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id; // Save user ID for later use
    next();
  } catch (err) {
    console.log("JWT Error:", err.message); // ✅ Debug
    res.status(400).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;

// This middleware checks for a JWT token in the request header.
// If the token is present and valid, it decodes the user ID and attaches it to the request object.
// If the token is missing or invalid, it sends an error response.
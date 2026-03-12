const jwt = require("jsonwebtoken");

/*
JWT Authentication Middleware
Checks Authorization header:
Authorization: Bearer <token>
*/

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if header exists
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "No token provided"
    });
  }

  // Extract token
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Invalid token format"
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secretkey"
    );

    req.user = decoded; // attach user info to request
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token verification failed"
    });
  }
};

module.exports = authMiddleware;
const jwt = require("jsonwebtoken");

<<<<<<< HEAD
module.exports = (req, res, next) => {

  const authHeader = req.headers.authorization;

  // Check if header exists
  if (!authHeader) {
    return res.status(401).json({
      message: "Token missing"
    });
  }

  // Extract token
=======
/*
JWT Authentication Middleware
Checks Authorization header:
Authorization: Bearer <token>
*/

const authMiddleware = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "No token provided"
    });
  }

>>>>>>> backend-consultation
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
<<<<<<< HEAD
=======
      success: false,
>>>>>>> backend-consultation
      message: "Invalid token format"
    });
  }

  try {

<<<<<<< HEAD
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;
=======
    const decoded = jwt.verify(token, "secretkey");

    req.user = decoded; // attach user info to request
>>>>>>> backend-consultation

    next();

  } catch (error) {

    return res.status(401).json({
<<<<<<< HEAD
      message: "Invalid token"
=======
      success: false,
      message: "Token verification failed"
>>>>>>> backend-consultation
    });

  }

<<<<<<< HEAD
};
=======
};

module.exports = authMiddleware;
>>>>>>> backend-consultation

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../errors");

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header and sets user data
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  // Check if Authorization header is present
  if (!authorization) {
    next(new UnauthorizedError("Authorization header is required."));
    return;
  }

  // Extract token from "Bearer <token>" format
  const token = authorization.replace("Bearer ", "");

  try {
    // Verify JWT token and extract user payload
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // Attach user data to request object
    next();
  } catch (err) {
    // Token is invalid or expired
    next(new UnauthorizedError("Invalid token."));
  }
};

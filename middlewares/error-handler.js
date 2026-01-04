/**
 * Central error handling middleware
 * Processes all errors and returns appropriate HTTP responses
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
module.exports = (err, req, res, next) => {
  // Handle Mongoose validation errors (invalid data format/requirements)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map((error) => error.message)
      .map((msg) => msg.replace(/^Path `(\w+)`\s*/, '$1 ')) // Clean up field names
      .join(', ');
    return res.status(400).json({ message: messages });
  }

  // Handle Mongoose CastError (invalid ObjectId format)
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'The id string is in an invalid format' });
  }

  // Handle MongoDB duplicate key error (unique constraint violation)
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Email already in use.' });
  }

  // Handle custom application errors (BadRequestError, UnauthorizedError, etc.)
  if (err.statusCode) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Default fallback for unexpected errors
  return res.status(500).json({ message: 'An error occurred on the server' });
};
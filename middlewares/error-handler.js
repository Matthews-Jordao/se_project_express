const { 
  BadRequestError, 
  UnauthorizedError, 
  ForbiddenError, 
  NotFoundError, 
  ConflictError 
} = require('../utils/errors');

module.exports = (err, req, res, next) => {
  console.error('Error:', err);

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map((error) => error.message)
      .map((msg) => msg.replace(/^Path `(\w+)`\s*/, '$1 ')) // Keep field name, remove "Path `"
      .join(', ');
    return res.status(400).json({ message: messages });
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'The id string is in an invalid format' });
  }

  // Handle MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Email already in use.' });
  }

  // Handle custom errors (BadRequestError, UnauthorizedError, etc.)
  if (err.statusCode) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Default server error
  return res.status(500).json({ message: 'An error occurred on the server' });
};
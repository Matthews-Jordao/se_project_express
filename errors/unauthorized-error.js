// Custom error class for 401 Unauthorized errors
// Used when authentication is required but missing or invalid
class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;

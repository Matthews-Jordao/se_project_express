// Custom error class for 403 Forbidden errors
// Used when user lacks permission to access a resource
class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;

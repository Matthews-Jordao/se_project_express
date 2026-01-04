// Custom error class for 404 Not Found errors
// Used when requested resource does not exist
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;

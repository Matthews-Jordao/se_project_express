// Custom error class for 400 Bad Request errors
// Used when client sends malformed or invalid data
class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;

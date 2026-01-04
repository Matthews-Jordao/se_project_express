// Custom error class for 409 Conflict errors
// Used when request conflicts with current state (e.g., duplicate email)
class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = ConflictError;

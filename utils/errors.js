// Error codes for my API
const BAD_REQUEST_ERROR = 400;
const UNAUTHORIZED_ERROR = 401;
const NOT_FOUND_ERROR = 404;
const CONFLICT_ERROR = 409;
const SERVER_ERROR = 500;

const handleUserError = (err, res) => {
  console.error('User error:', err);

  if (err.name === 'CastError') {
    return res.status(BAD_REQUEST_ERROR).send({ message: 'User id is not valid.' });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map((error) => error.message)
      .map((msg) => msg.replace(/^Path `(\w+)`\s*/, '$1 ')) // Keep field name, remove "Path `"
      .join(', ');
    return res.status(BAD_REQUEST_ERROR).send({ message: messages });
  }

  if (err.code === 11000) {
    return res.status(CONFLICT_ERROR).send({ message: 'Email already in use.' });
  }

  if (err.statusCode === NOT_FOUND_ERROR) {
    return res.status(NOT_FOUND_ERROR).send({ message: err.message });
  }

  return false;
};

module.exports = {
  BAD_REQUEST_ERROR,
  UNAUTHORIZED_ERROR,
  NOT_FOUND_ERROR,
  CONFLICT_ERROR,
  SERVER_ERROR,
  handleUserError,
};

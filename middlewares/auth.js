const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const { UNAUTHORIZED_ERROR } = require('../utils/errors');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(UNAUTHORIZED_ERROR).send({ message: 'Authorization header is required.' });
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    console.error('auth error:', err);
    res.status(UNAUTHORIZED_ERROR).send({ message: 'Invalid token.' });
  }
};
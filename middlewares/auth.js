const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../utils/errors");

module.exports = (req, res, next) => {
  console.log('=== AUTH DEBUG ===');
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('User-Agent:', req.headers['user-agent']);
  console.log('Authorization:', req.headers.authorization);

  const { authorization } = req.headers;

  if (!authorization) {
    console.log('Missing authorization header');
    next(new UnauthorizedError("Authorization header is required."));
    return;
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    console.log('Auth successful for user:', payload._id);
    next();
  } catch (err) {
    console.log('Auth failed:', err.message);
    next(new UnauthorizedError("Invalid token."));
  }
};

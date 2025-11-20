const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  SERVER_ERROR,
  UNAUTHORIZED_ERROR,
  handleUserError,
} = require('../utils/errors');
const { JWT_SECRET } = require('../utils/config');




// get current user
module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => {
      const error = new Error('User not found');
      error.statusCode = NOT_FOUND_ERROR;
      throw error;
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (!handleUserError(err, res)) {
        res.status(SERVER_ERROR).send({ message: 'Server had an issue finding user.' });
      }
    });
};


// add a new user
module.exports.createUser = (req, res) => {
  const { email, password, name, avatar } = req.body;

  // Validate required fields before hashing
  if (!email || !password || !name || !avatar) {
    res.status(BAD_REQUEST_ERROR).send({ message: 'email, password, name, and avatar are required.' });
    return;
  }

  // Hash password before creating user
  bcrypt.hash(password, 10)
    .then((hashedPassword) => User.create({ email, password: hashedPassword, name, avatar }))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.status(201).send(userObj);
    })
    .catch((err) => {
      if (!handleUserError(err, res)) {
        res.status(SERVER_ERROR).send({ message: 'Server had an issue creating user.' });
      }
    });
};

// login user
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  // Validate required fields before querying database
  if (!email || !password) {
    res.status(BAD_REQUEST_ERROR).send({ message: 'email and password are required.' });
    return;
  }

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email or password.'));
      }
      return bcrypt.compare(password, user.password)
        .then((isPasswordValid) => {
          if (!isPasswordValid) {
            return Promise.reject(new Error('Incorrect email or password.'));
          }
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
            expiresIn: '7d',
          });
          res.status(200).send({ token });
          return null;
        });
    })
    .catch((err) => {
      if (err.message === 'Incorrect email or password.') {
        res.status(UNAUTHORIZED_ERROR).send({ message: 'Incorrect email or password.' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Server had an issue logging in.' });
      }
    });
};

// update current user
module.exports.updateUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      const error = new Error('User not found');
      error.statusCode = NOT_FOUND_ERROR;
      throw error;
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (!handleUserError(err, res)) {
        res.status(SERVER_ERROR).send({ message: 'Server had an issue updating user.' });
      }
    });
};

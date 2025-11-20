const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  SERVER_ERROR,
  CONFLICT_ERROR,
  UNAUTHORIZED_ERROR,
  handleUserError,
} = require('../utils/errors');
const { JWT_SECRET } = require('../utils/config');

// get all users from db
module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    console.error('getUsers error:', err);
    res.status(SERVER_ERROR).send({ message: 'Server had an issue grabbing users.' });
  }
};


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

  User.create({ email, password, name, avatar })
    .then(async (user) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();
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
        });
    })
    .catch((err) => {
      console.error('login error:', err);
      if (err.message === 'Incorrect email or password.') {
        return res.status(UNAUTHORIZED_ERROR).send({ message: 'Incorrect email or password.' });
      }
      res.status(SERVER_ERROR).send({ message: 'Server had an issue logging in.' });
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

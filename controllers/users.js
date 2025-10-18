const User = require('../models/user');
const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  SERVER_ERROR,
} = require('../utils/errors');


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


// get a single user by id
module.exports.getUser = async (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error('No user with that id');
      error.statusCode = NOT_FOUND_ERROR;
      throw error;
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error('getUser error:', err);
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'User id is not valid.' });
      }
      if (err.statusCode === NOT_FOUND_ERROR) {
        return res.status(NOT_FOUND_ERROR).send({ message: err.message });
      }
      res.status(SERVER_ERROR).send({ message: 'Server had an issue finding user.' });
    });
};


// add a new user
module.exports.createUser = async (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error('createUser error:', err);
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'User info is not valid.' });
      }
      res.status(SERVER_ERROR).send({ message: 'Server had an issue creating user.' });
    });
};

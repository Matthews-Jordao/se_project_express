const express = require('express');
const { getUsers, getUser, createUser } = require('../controllers/users');

const router = express.Router();

// user routes
router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);

module.exports = router;

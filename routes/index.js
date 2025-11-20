const express = require('express');
const usersRouter = require('./users');
const clothingItemsRouter = require('./clothingItems');
const { login, createUser } = require('../controllers/users');
const { getClothingItems } = require('../controllers/clothingItems');
const auth = require('../middlewares/auth');
const { NOT_FOUND_ERROR } = require('../utils/errors');

const router = express.Router();

router.post('/signin', login);
router.post('/signup', createUser);

// Public route for getting all items
router.get('/items', getClothingItems);

// Protected routes
router.use(auth);
router.use('/users', usersRouter);
router.use('/items', clothingItemsRouter);

// catch-all for anything not matched above
router.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'No such route here.' });
});

module.exports = router;

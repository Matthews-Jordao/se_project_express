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

router.get('/items', getClothingItems);

router.use(auth);
router.use('/users', usersRouter);
router.use('/items', clothingItemsRouter);

router.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'No such route here.' });
});

module.exports = router;

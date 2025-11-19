const express = require('express');
const usersRouter = require('./users');
const clothingItemsRouter = require('./clothingItems');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/signin', login);
router.post('/signup', createUser);

router.use(auth);
router.use('/users', usersRouter);
router.use('/items', clothingItemsRouter);

// catch-all for anything not matched above
router.use('*', (req, res) => {
  res.status(404).send({ message: 'No such route here.' });
});

module.exports = router;

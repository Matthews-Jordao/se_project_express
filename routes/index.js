const express = require('express');
const usersRouter = require('./users');
const clothingItemsRouter = require('./clothingItems');

const router = express.Router();

router.use('/users', usersRouter);
router.use('/items', clothingItemsRouter);

// catch-all for anything not matched above
router.use('*', (req, res) => {
  res.status(404).send({ message: 'No such route here.' });
});

module.exports = router;

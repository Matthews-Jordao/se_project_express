const ClothingItem = require('../models/clothingItem');
const {
  BAD_REQUEST_ERROR,
  FORBIDDEN_ERROR,
  NOT_FOUND_ERROR,
  SERVER_ERROR,
} = require('../utils/errors');


// get all clothing items
module.exports.getClothingItems = async (req, res) => {
  try {
    const items = await ClothingItem.find({});
    res.status(200).send(items);
  } catch (err) {
    res.status(SERVER_ERROR).send({ message: 'Server had an issue grabbing items.' });
  }
};


// add a new clothing item
module.exports.createClothingItem = async (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors)
          .map((error) => error.message)
          .map((msg) => msg.replace(/^Path `(\w+)`\s*/, '$1 '))
          .join(', ');
        res.status(BAD_REQUEST_ERROR).send({ message: messages });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Server had an issue creating item.' });
      }
    });
};


// delete an item by id
module.exports.deleteClothingItem = async (req, res) => {
  ClothingItem.findById(req.params.itemId)
    .orFail(() => {
      const error = new Error('No item with that id');
      error.statusCode = NOT_FOUND_ERROR;
      throw error;
    })
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        const error = new Error('You do not have permission to delete this item');
        error.statusCode = FORBIDDEN_ERROR;
        throw error;
      }
      return ClothingItem.findByIdAndDelete(req.params.itemId);
    })
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Item id is not valid.' });
      } else if (err.statusCode === FORBIDDEN_ERROR) {
        res.status(FORBIDDEN_ERROR).send({ message: err.message });
      } else if (err.statusCode === NOT_FOUND_ERROR) {
        res.status(NOT_FOUND_ERROR).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Server had an issue deleting item.' });
      }
    });
};


// like an item
module.exports.likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error('No item with that id');
      error.statusCode = NOT_FOUND_ERROR;
      throw error;
    })
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Item id is not valid.' });
      } else if (err.statusCode === NOT_FOUND_ERROR) {
        res.status(NOT_FOUND_ERROR).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Server had an issue liking item.' });
      }
    });
};


// unlike an item
module.exports.dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error('No item with that id');
      error.statusCode = NOT_FOUND_ERROR;
      throw error;
    })
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Item id is not valid.' });
      } else if (err.statusCode === NOT_FOUND_ERROR) {
        res.status(NOT_FOUND_ERROR).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Server had an issue unliking item.' });
      }
    });
};

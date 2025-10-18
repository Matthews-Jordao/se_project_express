const ClothingItem = require('../models/clothingItem');
const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  SERVER_ERROR,
} = require('../utils/errors');


// get all clothing items
module.exports.getClothingItems = async (req, res) => {
  try {
    const items = await ClothingItem.find({});
    res.status(200).send(items);
  } catch (err) {
    console.error('getClothingItems error:', err);
    res.status(SERVER_ERROR).send({ message: 'Server had an issue grabbing items.' });
  }
};


// add a new clothing item
module.exports.createClothingItem = async (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error('createClothingItem error:', err);
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Item info is not valid.' });
      }
      res.status(SERVER_ERROR).send({ message: 'Server had an issue creating item.' });
    });
};



// delete an item by id
module.exports.deleteClothingItem = async (req, res) => {
  ClothingItem.findByIdAndDelete(req.params.itemId)
    .orFail(() => {
      const error = new Error('No item with that id');
      error.statusCode = NOT_FOUND_ERROR;
      throw error;
    })
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error('deleteClothingItem error:', err);
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Item id is not valid.' });
      }
      if (err.statusCode === NOT_FOUND_ERROR) {
        return res.status(NOT_FOUND_ERROR).send({ message: err.message });
      }
      res.status(SERVER_ERROR).send({ message: 'Server had an issue deleting item.' });
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
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error('likeItem error:', err);
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Item id is not valid.' });
      }
      if (err.statusCode === NOT_FOUND_ERROR) {
        return res.status(NOT_FOUND_ERROR).send({ message: err.message });
      }
      res.status(SERVER_ERROR).send({ message: 'Server had an issue liking item.' });
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
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error('dislikeItem error:', err);
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Item id is not valid.' });
      }
      if (err.statusCode === NOT_FOUND_ERROR) {
        return res.status(NOT_FOUND_ERROR).send({ message: err.message });
      }
      res.status(SERVER_ERROR).send({ message: 'Server had an issue unliking item.' });
    });
};

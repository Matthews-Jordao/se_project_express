const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../utils/errors");

module.exports.getClothingItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find({});
    res.status(200).send(items);
  } catch (err) {
    next(err);
  }
};

module.exports.createClothingItem = async (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  try {
    console.log('=== CREATE ITEM DEBUG ===');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    console.log('User:', req.user);

    // If there's a file upload, use the uploaded file path
    let finalImageUrl;
    if (req.file) {
      // Use environment-specific URL construction
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : req.protocol;
      const host = process.env.NODE_ENV === 'production' ? 'api.wtwr.bad.mn' : req.get('host');
      finalImageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
      console.log('File upload URL:', finalImageUrl);
    } else if (imageUrl) {
      finalImageUrl = imageUrl;
      console.log('Regular URL:', finalImageUrl);
    } else {
      console.log('No image provided');
      throw new BadRequestError("Either upload a file or provide an image URL");
    }

    const item = await ClothingItem.create({
      name,
      weather,
      imageUrl: finalImageUrl,
      owner
    });

    console.log('Created item:', item);
    console.log('Sending response with status 201');
    res.status(201).send(item);
    console.log('Response sent successfully');
  } catch (err) {
    console.log('Error creating item:', err);
    console.log('Error name:', err.name);
    console.log('Error message:', err.message);
    next(err);
  }
};

module.exports.deleteClothingItem = async (req, res, next) => {
  ClothingItem.findById(req.params.itemId)
    .orFail(() => {
      throw new NotFoundError("No item with that id");
    })
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError(
          "You do not have permission to delete this item"
        );
      }
      return ClothingItem.findByIdAndDelete(req.params.itemId);
    })
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

module.exports.likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("No item with that id");
    })
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("No item with that id");
    })
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

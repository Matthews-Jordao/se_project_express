const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} = require("../errors");
const { JWT_SECRET } = require("../utils/config");

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError("User not found");
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name, avatar } = req.body;

  if (!email || !password || !name || !avatar) {
    next(new BadRequestError("email, password, name, and avatar are required."));
    return;
  }

  // Convert email to lowercase for case-insensitive storage
  const normalizedEmail = email.toLowerCase().trim();

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ email: normalizedEmail, password: hashedPassword, name, avatar })
    )
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.status(201).send(userObj);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new BadRequestError("email and password are required."));
    return;
  }

  // Convert email to lowercase for case-insensitive matching
  const normalizedEmail = email.toLowerCase().trim();

  User.findOne({ email: normalizedEmail })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError("Incorrect email or password."));
      }
      return bcrypt.compare(password, user.password).then((isPasswordValid) => {
        if (!isPasswordValid) {
          return Promise.reject(new UnauthorizedError("Incorrect email or password."));
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        res.status(200).send({ token });
        return null;
      });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, avatarUrl } = req.body;

  try {
    // If there's a file upload, use the uploaded file path
    let finalAvatarUrl;
    if (req.file) {
      // Use environment-specific URL construction
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : req.protocol;
      const host = process.env.NODE_ENV === 'production' ? 'api.wtwr.bad.mn' : req.get('host');
      finalAvatarUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    } else if (avatarUrl) {
      finalAvatarUrl = avatarUrl;
    } else {
      throw new BadRequestError("Either upload a file or provide an avatar URL");
    }

    User.findByIdAndUpdate(
      req.user._id,
      { name, avatar: finalAvatarUrl },
      { new: true, runValidators: true },
    )
      .orFail(() => {
        throw new NotFoundError("User not found");
      })
      .then((user) => {
        res.status(200).send(user);
      })
      .catch((err) => {
        if (err.name === "CastError") {
          next(new BadRequestError("The id string is in an invalid format"));
        } else {
          next(err);
        }
      });
  } catch (err) {
    next(err);
  }
};

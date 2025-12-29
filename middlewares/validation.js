const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

// Custom URL validation function
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

// Clothing item validation
module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    weather: Joi.string().required().valid('hot', 'warm', 'cold').messages({
      "string.empty": 'The "weather" field must be filled in',
      "any.only": 'Weather must be one of: hot, warm, cold',
    }),
    // Make imageUrl optional since we can use file upload instead
    imageUrl: Joi.string().custom(validateURL).messages({
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});

// User registration validation
module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'the "avatar" field must be a valid url',
    }),
    email: Joi.string().required().email().messages({
      "string.email": 'The "email" field must be a valid email',
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// User login validation
module.exports.validateAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email": 'The "email" field must be a valid email',
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// ID validation for params (user ID and item ID)
module.exports.validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).messages({
      "string.hex": 'Invalid ID format',
      "string.length": 'ID must be 24 characters long',
    }),
  }),
});

// User ID validation
module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).messages({
      "string.hex": 'Invalid user ID format',
      "string.length": 'User ID must be 24 characters long',
    }),
  }),
});

// Update user validation
module.exports.validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
    }),
    avatar: Joi.string().custom(validateURL).messages({
      "string.uri": 'the "avatar" field must be a valid url',
    }),
  }),
});
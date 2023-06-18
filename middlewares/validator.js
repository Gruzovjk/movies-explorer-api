const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
// const { regex } = require('../utils/regex');
const { BadRequestError } = require('../errors/index');

const validateUrl = (url) => {
  const result = validator.isURL(url);
  if (result) {
    return url;
  }
  throw new BadRequestError('Неккоректная ссылка на изображение');
};

const validateSignUp = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
});

// дописать валидацию создания фильма
const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validateUrl),
    trailerLink: Joi.string().required().custom(validateUrl),
    thumbnail: Joi.string().required().custom(validateUrl),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().required().length(24),
  }),
});

module.exports = {
  validateSignUp,
  validateSignIn,
  validateUpdateProfile,
  validateCreateMovie,
  validateId,
};

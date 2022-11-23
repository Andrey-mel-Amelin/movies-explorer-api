const { celebrate, Joi } = require('celebrate');
const { REGEX_URL } = require('../constants/index');

const validId = (typeId) => celebrate({
  params: Joi.object().keys({
    [typeId]: Joi.string().hex().length(24),
  }),
});

const validAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
});

const validUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email().required(),
  }),
});

const validDataMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(REGEX_URL),
    trailerLink: Joi.string().required().regex(REGEX_URL),
    thumbnail: Joi.string().required().regex(REGEX_URL),
    owner: Joi.string().hex().length(24),
    movieId: Joi.string().hex().length(24),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports = {
  validId,
  validAuth,
  validUserInfo,
  validDataMovie,
};

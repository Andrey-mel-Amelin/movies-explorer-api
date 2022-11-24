const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  VALIDATION_ERROR,
  CAST_ERROR,
} = require('../constants');
const DublicateKeyError = require('../errors/DublicateKeyError');
const NotFoundError = require('../errors/NotFoundError');
const BadReqError = require('../errors/BadReqError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => User.findById(user._id))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === VALIDATION_ERROR) {
        return next(new BadReqError('Переданы некорректные данные при создании пользователя.'));
      }
      if (err.code === 11000) {
        return next(new DublicateKeyError('Пользователь с таким email уже существует.'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'None',
          secure: true,
        })
        .send({ message: 'Пользователь успешно авторизирован.' });
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res
    .clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    .send({ message: 'Пользователь успешно вышел.' });
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь не найден.'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        return next(new BadReqError('Передан некорректный _id для поиска пользователя.'));
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Пользователь не найден.'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === VALIDATION_ERROR) {
        return next(new BadReqError('Переданы некорректные данные при обновлении пользователя.'));
      }
      if (err.code === 11000) {
        return next(new DublicateKeyError('Пользователь с таким email уже существует.'));
      }
      return next(err);
    });
};

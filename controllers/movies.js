const Movie = require('../models/movie');
const User = require('../models/user');
const { CAST_ERROR, VALIDATION_ERROR } = require('../constants');
const BadReqError = require('../errors/BadReqError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const DublicateKeyError = require('../errors/DublicateKeyError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      const moviesForUser = movies.filter((movie) => movie.owner.equals(req.user._id));
      res.send(moviesForUser);
    })
    .catch(next);
};

module.exports.saveMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  User.findById(req.user._id)
    .then((user) => {
      Movie.create({
        country,
        director,
        duration,
        year,
        description,
        image,
        trailerLink,
        thumbnail,
        movieId,
        nameRU,
        nameEN,
        owner: user._id,
      })
        .then((movie) => res.send(movie))
        .catch((err) => {
          if (err.message === VALIDATION_ERROR) {
            return next(new BadReqError('Переданы некорректные данные при создании фильма.'));
          }
          if (err.code === 11000) {
            return next(new DublicateKeyError('Такой фильм уже сохранён.'));
          }
          return next(err);
        });
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError('Фильм с указанным _id не найден.'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenError('У вас отсутствуют права для удаления фильма.'));
      }
      return Movie.findByIdAndDelete(movie._id.toString()).then(() => {
        res.send(movie);
      });
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        return next(new BadReqError('Переданы некорректные данные фильма.'));
      }
      return next(err);
    });
};

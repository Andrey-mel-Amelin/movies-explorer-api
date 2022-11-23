const { isURL } = require('validator');
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      validate: [isURL, 'Некорректный URL адрес.'],
    },
    trailerLink: {
      type: String,
      required: true,
      validate: [isURL, 'Некорректный URL адрес.'],
    },
    thumbnail: {
      type: String,
      required: true,
      validate: [isURL, 'Некорректный URL адрес.'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
    },
    nameEN: {
      type: String,
      required: true,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('movie', movieSchema);

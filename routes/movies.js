const router = require('express').Router();
const { validDataMovie, validId } = require('../middlewares/joiValidation');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', validDataMovie, createMovie);
router.delete('/:movieId', validId('movieId'), deleteMovie);

module.exports = router;

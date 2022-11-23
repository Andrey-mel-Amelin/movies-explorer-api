const router = require('express').Router();

const NotFoundError = require('../errors/NotFoundError');
const { login, createUser } = require('../controllers/users');
const { validAuth } = require('../middlewares/joiValidation');
const auth = require('../middlewares/auth');
const allowedCors = require('../middlewares/allowedCors');

router.use(allowedCors);

router.post('/signup', validAuth, createUser);
router.post('/signin', validAuth, login);
router.use(auth);
router.use('/movies', require('./movies'));
router.use('/users', require('./users'));

router.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден.'));
});

module.exports = router;

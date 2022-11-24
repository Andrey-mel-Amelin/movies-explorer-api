const router = require('express').Router();

const NotFoundError = require('../errors/NotFoundError');
const { login, createUser, logout } = require('../controllers/users');
const { validAuth, validUserInfo } = require('../middlewares/joiValidation');
const auth = require('../middlewares/auth');
const allowedCors = require('../middlewares/allowedCors');

router.use(allowedCors);

router.post('/signup', validAuth, createUser);
router.post('/signin', validUserInfo, login);
router.delete('/signout', logout);
router.use(auth);
router.use('/movies', require('./movies'));
router.use('/users', require('./users'));

router.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден.'));
});

module.exports = router;

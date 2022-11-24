const router = require('express').Router();
const {
  validUserInfo,
} = require('../middlewares/joiValidation');
const {
  getMe,
  updateUser,
} = require('../controllers/users');

router.get('/me', getMe);
router.patch('/me', validUserInfo, updateUser);

module.exports = router;

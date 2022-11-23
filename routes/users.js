const router = require('express').Router();
const {
  validUserInfo,
} = require('../middlewares/joiValidation');
const {
  getMe,
  updateUser,
  logout,
} = require('../controllers/users');

router.get('/me', getMe);
router.patch('/me', validUserInfo, updateUser);
router.delete('/signout', logout);

module.exports = router;

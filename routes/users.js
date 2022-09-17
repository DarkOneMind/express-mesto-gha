const router = require('express').Router();
const {
  getUserInfo,
  getUserId,
  createUser,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUserInfo);
router.get('/:id', getUserId);
router.post('/', createUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;

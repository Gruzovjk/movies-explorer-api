const router = require('express').Router();

const {
  updateProfile,
  getCurrentUser,
  getUsers,
} = require('../controllers/users');

const { validateUpdateProfile } = require('../middlewares/validator');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.patch('/me', validateUpdateProfile, updateProfile);

module.exports = router;

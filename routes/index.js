const router = require('express').Router();
const { validateSignUp, validateSignIn } = require('../middlewares/validator');
const { NotFoundError } = require('../errors/index');

const usersRoutes = require('./users');
const moviesRoutes = require('./movies');
const { createUser, login, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signup', validateSignUp, createUser);
router.post('/signin', validateSignIn, login);
router.post('/signout', logout);
router.use('/users', auth, usersRoutes);
router.use('/movies', auth, moviesRoutes);
router.use('*', auth, () => {
  throw new NotFoundError('По указанному URL ничего нет');
});

module.exports = router;

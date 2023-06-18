const router = require('express').Router();

const {
  getSavedMovies,
  createMovie,
  removeMovieById,
} = require('../controllers/movies');

const { validateId, validateCreateMovie } = require('../middlewares/validator');

router.get('/', getSavedMovies);
router.post('/', validateCreateMovie, createMovie);
router.delete('/:id', validateId, removeMovieById);

module.exports = router;

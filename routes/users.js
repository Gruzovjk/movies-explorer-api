const router = require('express').Router();

const {
  getMovieById,
  createMovie,
  removeMovieById,
} = require('../controllers/movies');

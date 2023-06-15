/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
const Movie = require('../models/movie');

const {
  ForbiddenError,
  NotFoundError,
  BadRequestError,
} = require('../errors/index');

exports.getSavedMovies = (req, res, next) => {
  const userId = req.user._id;
  Movie.find({ owner: userId })
    .then((movies) => {
      if (movies.length === 0) {
        const error = new NotFoundError('Нет сохраненных фильмов');
        return next(error);
      }
      return res.json(movies);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequestError('Некорректный id');
        return next(error);
      }
      return next(err);
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new BadRequestError(
          `Переданы некорректные данные - ${err.name - err.message}`,
        );
        return next(error);
      }
      return next(err);
    });
};

module.exports.removeMovieById = (req, res, next) => {
  const movieId = req.params.id;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        const error = new NotFoundError('Фильм с таким id не найден');
        return next(error);
      }
      if (!movie.owner.equals(req.user._id)) {
        const error = new ForbiddenError('Нельзя удалить чужую карточку');
        return next(error);
      }
      return movie
        .deleteOne()
        .then(() => res.status(200).send({ message: 'Фильм успешно удален' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequestError('Некорректный id');
        return next(error);
      }
      return next(err);
    });
};

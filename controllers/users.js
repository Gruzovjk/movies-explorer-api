/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
const jwt = require('jsonwebtoken');
const { hash } = require('bcrypt');
const User = require('../models/user');
require('dotenv').config();

const {
  ConflictingRequestError,
  NotFoundError,
  BadRequestError,
} = require('../errors/index');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        const error = new NotFoundError('Пользователь с таким id не найден');
        return next(error);
      }
      return res.send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, email } = req.body;
  hash(req.body.password, 10)
    .then((dataHash) => {
      User.create({
        name,
        email,
        password: dataHash,
      })
        .then((user) =>
          res.status(201).send({
            name: user.name,
            email: user.email,
            _id: user._id,
          }),
        )
        .catch((err) => {
          if (err.name === 'ValidationError') {
            const error = new BadRequestError(
              `Переданы некорректные данные - ${err.name - err.message}`,
            );
            return next(error);
          }
          if (err.code === 11000) {
            const error = new ConflictingRequestError(
              'Пользователь с таким e-mail уже существует',
            );
            return next(error);
          }
          return next(err);
        });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
        {
          expiresIn: '7d',
        },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: true,
        })
        .send(user.toJSON());
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    { _id: req.user._id },
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        const error = new NotFoundError('Пользователь с таким id не найден');
        return next(error);
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        const error = new BadRequestError(
          `Некорректный id или неправильно заполнены поля - ${
            err.name - err.message
          }`,
        );
        return next(error);
      }
      return next(err);
    });
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Вы вышли из системы' });
};

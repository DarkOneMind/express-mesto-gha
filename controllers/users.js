const User = require('../models/user');
const { DataError, NotFoundError, serverError } = require('../errors');

module.exports.getUserInfo = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((error) => {
      if (error.name) {
        res
          .status(DataError)
          .send({
            message: 'Некорректный id',
          });
      } else {
        res
          .status(serverError)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => new Error('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'CastError') {
        res
          .status(DataError)
          .send({
            message: 'Некорректный id',
          });
      } else if (error.name === 'Error') {
        res
          .status(NotFoundError)
          .send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res
          .status(serverError)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res
          .status(DataError)
          .send({
            message: 'Некорректный id',
          });
      } else {
        res
          .status(serverError)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findOneAndUpdate(
    { _id },
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => new Error('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'Error') {
        res
          .status(NotFoundError)
          .send({ message: 'Пользователь не найден' });
      } else if (error.name === 'ValidationError') {
        res
          .status(DataError)
          .send({
            message: 'Переданы некорректные данные при обновлении пользователя',
          });
      } else {
        res
          .status(serverError)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.findOneAndUpdate({ _id }, { avatar }, { new: true, runValidators: true })
    .orFail(() => new Error('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'Error') {
        res
          .status(NotFoundError)
          .send({ message: 'Пользователь не найден' });
      } else if (error.name === 'ValidationError') {
        res
          .status(DataError)
          .send({
            message: 'Некорректный id',
          });
      } else {
        res
          .status(serverError)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

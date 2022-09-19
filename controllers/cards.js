const Cards = require('../models/card');
const { DataError, NotFoundError, serverError } = require('../errors');

module.exports.getInitialCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(serverError).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Cards.create({
    name,
    link,
    owner: _id,
  })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(DataError).send({
          message: 'Некорректный id',
        });
      } else {
        res
          .status(serverError)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteCards = (req, res) => {
  const { cardId } = req.params;
  Cards.findOneAndRemove({ _id: cardId })
    .orFail(() => new Error('NotFound'))
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'CastError') {
        res
          .status(DataError)
          .send({ message: 'Некорректный id' });
      } else if (error.name === 'Error') {
        res.status(NotFoundError).send({
          message: 'Данных нет',
        });
      } else {
        res
          .status(serverError)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.like = (req, res) => {
  const { _id } = req.user;
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: _id } },
    { new: true },
  )
    .orFail(() => new Error('NotFound'))
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'CastError') {
        res
          .status(DataError)
          .send({ message: 'Некорректный id' });
      } else if (error.name === 'Error') {
        res.status(NotFoundError).send({
          message: 'Данных нет',
        });
      } else {
        res
          .status(serverError)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.dislike = (req, res) => {
  const { _id } = req.user;
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: _id } },
    { new: true },
  )
    .orFail(() => new Error('NotFound'))
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'CastError') {
        res
          .status(DataError)
          .send({ message: 'Некорректный id' });
      } else if (error.name === 'Error') {
        res.status(NotFoundError).send({
          message: 'Данных нет',
        });
      } else {
        res
          .status(serverError)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const Cards = require("../models/card");
const { DataError, NotFoundError, serverError } = require("../errors");

module.exports.getInitialCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(DataError).send({
          message: "Переданы некорректные данные при получении карточки",
        });
      } else {
        res
          .status(serverError)
          .send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.addCard = (req, res) => {
  const { name, link, likes } = req.body;
  const { _id } = req.user;
  Cards.create({
    name,
    link,
    likes,
    owner: _id,
  })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(DataError).send({
          message: "Переданы некорректные данные при создании карточки",
        });
      } else {
        res
          .status(serverError)
          .send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.deleteCards = (req, res) => {
  const { cardId } = req.params;
  Cards.findOneAndRemove({ _id: cardId })
    .orFail(() => {
      throw new Error("Карточка с указанным _id не найдена");
    })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === "CastError") {
        res
          .status(DataError)
          .send({ message: "Карточка с указанным _id не найдена" });
      } else if (error.name === "Error") {
        res.status(NotFoundError).send({
          message: "Переданы некорректные данные для постановки лайка",
        });
      } else {
        res
          .status(serverError)
          .send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.like = (req, res) => {
  const { _id } = req.user;
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: _id } },
    { new: true }
  )
    .orFail(() => {
      throw new Error("Карточка не найдена");
    })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === "CastError") {
        res
          .status(DataError)
          .send({
            message: "Переданы некорректные данные для постановки лайка",
          });
      } else if (error.name === "Error") {
        res.status(NotFoundError).send({
          message: "Переданы некорректные данные для постановки лайка",
        });
      } else {
        res
          .status(serverError)
          .send({ message: "На сервере произошла ошибка" });
      }
    });
};

module.exports.dislike = (req, res) => {
  const { _id } = req.user;
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: _id } },
    { new: true }
  )
    .orFail(() => {
      throw new Error("Карточка не найдена");
    })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === "CastError") {
        res
          .status(DataError)
          .send({ message: "Передан несуществующий _id карточки" });
      } else if (error.name === "Error") {
        res.status(NotFoundError).send({
          message: "Переданы некорректные данные для снятия лайка",
        });
      } else {
        res
          .status(serverError)
          .send({ message: "На сервере произошла ошибка" });
      }
    });
};

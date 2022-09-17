const router = require('express').Router();
const {
  getInitialCards,
  addCard,
  deleteCards,
  like,
  dislike,
} = require('../controllers/cards');

router.get('/', getInitialCards);
router.post('/', addCard);
router.delete('/:cardId', deleteCards);
router.put('/:cardId/likes', like);
router.delete('/:cardId/likes', dislike);

module.exports = router;

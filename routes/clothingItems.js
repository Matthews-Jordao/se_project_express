const express = require('express');
const { createClothingItem, deleteClothingItem, likeItem, dislikeItem } = require('../controllers/clothingItems');

const router = express.Router();

router.post('/', createClothingItem);
router.delete('/:itemId', deleteClothingItem);
router.put('/:itemId/likes', likeItem);
router.delete('/:itemId/likes', dislikeItem);

module.exports = router;

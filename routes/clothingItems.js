const express = require('express');
const { getClothingItems, createClothingItem, deleteClothingItem, likeItem, dislikeItem } = require('../controllers/clothingItems');

const router = express.Router();

// clothing item routes
router.get('/', getClothingItems);
router.post('/', createClothingItem);
router.delete('/:itemId', deleteClothingItem);
router.put('/:itemId/likes', likeItem);
router.delete('/:itemId/likes', dislikeItem);

module.exports = router;

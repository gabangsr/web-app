const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemController');

router.get('/items', itemsController.getAllItems);
router.post('/items', itemsController.createItem);
router.put('/items/:id', itemsController.updateItem);
router.patch('/items/:id', itemsController.partiallyUpdateItem);
router.delete('/items/:id', itemsController.deleteItem);

module.exports = router;

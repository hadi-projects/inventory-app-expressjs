const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/', inventoryController.getAllItems);
router.get('/add', inventoryController.getAddPage);
router.post('/add', inventoryController.addItem);
router.get('/edit/:id', inventoryController.getEditPage);
router.post('/edit/:id', inventoryController.updateItem);
router.get('/delete/:id', inventoryController.deleteItem);

module.exports = router;
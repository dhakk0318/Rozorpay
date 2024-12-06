const express = require('express');
const router = express.Router();
const orderItemController = require('../controller/orderItemController');

 router.post('/add-order-items', orderItemController.addOrderItem);

module.exports = router;

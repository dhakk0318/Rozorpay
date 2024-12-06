const express = require('express');
const router = express.Router();
const orderController = require('../Controller/orderController');

 router.post('/create-order', orderController.createOrder);

module.exports = router;

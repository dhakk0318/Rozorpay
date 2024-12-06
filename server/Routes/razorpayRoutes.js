const express = require('express');
const router = express.Router();
const razorpayController = require('../Controller/razorpayController');

 router.post('/createOrder', razorpayController.createOrder);

 router.post('/verifyPayment', razorpayController.verifyPayment);

module.exports = router;

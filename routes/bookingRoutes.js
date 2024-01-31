const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

// Route middleware
const router = express.Router(); 

router.get('/checkout/:tourId', authController.protect, bookingController.getCheckout);
 
module.exports = router;
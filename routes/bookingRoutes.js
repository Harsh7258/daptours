const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

// Route middleware
const router = express.Router(); 

router.use(authController.protect);

router.get('/checkout/:tourId',  bookingController.getCheckout);

router.use(authController.restrictTo('admin'));

router.route('/').get(bookingController.getAllBooking).post(bookingController.createBooking);

router.route('/:id').get(bookingController.getBooking).patch(bookingController.updateBooking).delete(bookingController.deleteBooking);
 
module.exports = router;
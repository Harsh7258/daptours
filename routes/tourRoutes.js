const express = require('express');
const tourController = require('./../controllers/tourController');

// Route --> use for same URLs
// 3. ROUTES

const router = express.Router();
// ROUTER middleware 

router
.route('/')
.get(tourController.getAllTours)
.post(tourController.createTour);

router
.route('/:id')
.get(tourController.getTour)
.patch(tourController.updateTour)
.delete(tourController.deleteTour);

module.exports = router;
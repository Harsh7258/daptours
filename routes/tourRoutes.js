const express = require('express');
const tourController = require('./../controllers/tourController');

// Route --> use for same URLs
// 3. ROUTES

const router = express.Router();
// ROUTER middleware 

router.param('id', tourController.checkID);

router
.route('/')
.get(tourController.getAllTours)
.post(tourController.checkBody, tourController.createTour);
// chaining mutliple middlewares

router
.route('/:id')
.get(tourController.getTour)
.patch(tourController.updateTour)
.delete(tourController.deleteTour);

module.exports = router;
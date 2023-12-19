const express = require('express');
const tourController = require('./../controllers/tourController');

// Route --> use for same URLs
// 3. ROUTES

const router = express.Router();
// ROUTER middleware 

router.route('/top-5-cheap-tours').get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getToursStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

// router.param('id', tourController.checkID);

router
.route('/')
.get(tourController.getAllTours)
.post(tourController.createTour);
// chaining mutliple middlewares

router
.route('/:id')
.get(tourController.getTour)
.patch(tourController.updateTour)
.delete(tourController.deleteTour);

module.exports = router;
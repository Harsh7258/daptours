const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

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
.get(authController.protect, tourController.getAllTours)
.post(tourController.createTour);
// chaining mutliple middlewares
// PROTECT middleware runs first then getAllTours to check if user is logged in(autherization token).

router
.route('/:id')
.get(tourController.getTour)
.patch(tourController.updateTour)
.delete(tourController.deleteTour);

module.exports = router;
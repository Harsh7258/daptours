const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

// Route middleware
const router = express.Router({ mergeParams: true }); // merges the parameters to this router ex-->

// POST /tour/rierjn343d/reviews
// GET /tour/rierjn343d/reviews
// POST /reviews

router.route('/').get(reviewController.getAllReviews).post(authController.protect, authController.restrictTo('user'), reviewController.setTourUserIds, reviewController.createReview);
// only for USER access

router.route('/:id').get(reviewController.getReview).patch(reviewController.updateReview).delete(reviewController.deleteReview);
 
module.exports = router;

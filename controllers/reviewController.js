const Review = require('./../modals/reviewModal');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

// REVIEW handlers
exports.getAllReviews = catchAsync(async (req, res, next) => {

    // adding a Nested GET endpoint
    let filter = {};
    if(req.params.tourId) filter = { tour: req.params.tourId };
    const reviews = await Review.find(filter);

    res.status(200).json({
        status: 'success',
        result: reviews.length,
        data: {
            reviews
        }
    });
});

exports.setTourUserIds = (req, res, next) => {
    // allow nested routes
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id;

    next();
};

exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

// exports.updateReview = catchAsync(async (req, res, next) => {
//     const reviews = await Review.find();

//     res.status(200).json({
//         status: 'success',
//         result: reviews.length,
//         data: {
//             reviews
//         }
//     });
// });

// exports.deleteReview = catchAsync(async (req, res, next) => {
//     const reviews = await Review.find();

//     res.status(200).json({
//         status: 'success',
//         result: reviews.length,
//         data: {
//             reviews
//         }
//     });
// });
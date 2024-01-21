const Tour = require('./../modals/tourModal');
const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// 2. ROUTE HANDLERS or CONTROLLERS
// route handler --> in express terms

// TOURS
exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' }); // path to populate field
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
};

// 1.1 AGGREGATION PIPELINE --> framework for data aggregation, used for calculating averages
// MATCHING AND GROUPING
exports.getToursStats = catchAsync(async (req, res, next) => {

        const stats = await Tour.aggregate([
            // {
            //     $match: { ratingsAverage: { $gte: 4.5 } }
            // },
            {
                $group: {
                    _id: { $toUpper: "$difficulty" },
                    numTours: { $sum: 1 },
                    numRatings: { $sum: "$ratingsQuantity" },
                    avgRating: { $avg: "$ratingsAverage" },
                    avgPrice: { $avg: "$price" },
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" }
                }
            },
            {
                $sort: { avgPrice: 1 }
                // arrange in assending order
            },
            // {
            //     $match: { _id: { $ne: 'EASY' } }
            // }
        ]); // array is called stages

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });
        // console.log(stats);
});

// 1.2 AGGREGATION PIPELINE: UWINDING AND PROJECTING
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {

        const year = req.params.year * 1; //2021

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
                // unwind Deconstructs an array field from the input documents to output a document for each element
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    }
                }
            },
            {
                $group: {
                    _id: {$month: '$startDates'},
                    numToursStart: { $sum: 1 },
                    // numbers of tour at particular month
                    toursName: { $push: '$name' }
                }
            },
            {
                $addFields: { month: '$_id' }
            },
            {
                $sort: { numToursStart: -1 }
                // sorts in descending order
            },
            {
                $project: {
                    _id: 0
                    // id will not show if 1 it will show
                }
            },
            {
                $limit: 3
                // show top 3
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        });
        // console.log(plan);
});
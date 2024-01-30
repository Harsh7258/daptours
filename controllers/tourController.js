const multer = require('multer');
const sharp = require('sharp');
const Tour = require('./../modals/tourModal');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// Uploading multiple images: TOURS
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadTourPhotos = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
]);

// upload.single('image') req.file
// upload.array('images', 5) req.files

exports.resizeTourPhoto = catchAsync(async (req, res, next) => {
    // console.log(req.files);

    if (!req.files.imageCover || !req.files.images) return next(); 

    // 1. Cover image
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer).resize(2000, 1333).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/img/tours/${req.body.imageCover}`);

    // 2. images
    req.body.images = [];

    await Promise.all(
        req.files.images.map(async (file, i) => {
            const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

            await sharp(file.buffer).resize(2000, 1333).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/img/tours/${filename}`);

            req.body.images.push(filename);
        })
    );
    next();
});

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

exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, laglng, unit } = req.params;
    const [lag, lng] = laglng.split(',');
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if(!lag || !lng) {
        next(new AppError('pLEASE PROVIDE lagitude and longitude in the format lag, lng.', 400));
    };

    const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[lng, lag], radius] } } });

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            data: tours
        }
    });
});

exports.getDistances = catchAsync(async (req, res, next) => {
    const { laglng, unit } = req.params;
    const [lag, lng] = laglng.split(',');

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

    if(!lag || !lng) {
        next(new AppError('pLEASE PROVIDE lagitude and longitude in the format lag, lng.', 400));
    };

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lag * 1]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            data: distances
        }
    });
});
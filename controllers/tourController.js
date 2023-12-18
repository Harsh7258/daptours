const Tour = require('./../modals/tourModal');
const APIFeatures = require('./../utils/apiFeatures');

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// 2. ROUTE HANDLERS or CONTROLLERS
// route handler --> in express terms

// TOURS
exports.getAllTours = async (req, res) => {
    try {
        
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    // retrun this --> helps to chain this methods
    // creating new APIFeatures class and passing a query obj (Tour.find())
    // then query string (req.query)
    // class methods used to manipulate query

    const tours = await features.query;

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            // requestedAt: req.requestTime,
            results: tours.length,
            data: {
                tours
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'Fail',
            message: error
        });
    };
};

exports.getTour = async (req, res) => {

    try {
        const tour = await Tour.findById(req.params.id);
        // findById just for id in the data

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'Fail',
            message: error
        });
    };
};

exports.createTour = async (req, res) => {
    try {
        // cosnt newTour = new Tour({});
        // newTour.save();
        // another way of creating document

    const newTour = await Tour.create(req.body);
    // using async await because Tour.create returns a promise

    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    });
    } catch (error) {
        res.status(400).json({
            status: 'Failed',
            message: error
        });
    };
};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            // new:true to return the modified document rather than the original
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'Failed',
            message: error
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        res.status(400).json({
            status: 'Failed',
            message: error
        });
    }
};
// in RESTful API it is commom practice not to send back any data to the client when there was DELETE operations

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
}
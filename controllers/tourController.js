const Tour = require('./../modals/tourModal');

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// 2. ROUTE HANDLERS or CONTROLLERS
// route handler --> in express terms

// TOURS
exports.getAllTours = async (req, res) => {
    try {

        //BUILD QUERY
        // 1.1 FILTERING THE API
        const queryObj = {...req.query};
        const excludedFields = ['page', 'fields', 'limit', 'sort'];
        excludedFields.forEach(el => delete queryObj[el]);

        // 1.2 ADVANCE FILTERING 
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        // gte = greater than equal to, lt = less than, gt = great than
        console.log(JSON.parse(queryStr));

    let query = Tour.find(JSON.parse(queryStr));
    // to find all documents/data 

    // 2. SORTING
    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        console.log(sortBy);
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
        // set according time
    }

    // 3. LIMITING FIELDS
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        console.log(fields);
        query.select(fields);
    } else {
        query = query.select('-__v');
        // exclude this field
    }

    // 4. PAGINATION
    const pages = req.query.page *  1 || 1;
    // converts string into a number
    const limit = req.query.limit * 1 || 100;
    const skip = (pages - 1) * limit;

    query = query.skip(skip).limit(limit);

    if(req.query.page){
        const numTours = await Tour.countDocuments();
        if(skip >= numTours) throw new Error('This page does not exists!!');
    }

    // console.log(req.params);
    // console.log(req.requestTime);

    // EXECUTE QUERY
    const tours = await query;

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
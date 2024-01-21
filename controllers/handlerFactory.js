const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

// Building Handler Factory Functions: DELETE
exports.deleteOne = Model => catchAsync(async (req, res, next) => {

    const doc = await Model.findByIdAndDelete(req.params.id);

    if(!doc) {
        return next(new AppError('NO document found with this ID!!', 404))
    };
    
        res.status(204).json({
            status: 'success',
            data: null
        });
});
// in RESTful API it is commom practice not to send back any data to the client when there was DELETE operations

// Factory Function: CREATE and UPDATE
exports.updateOne = Model => catchAsync(async (req, res, next) => {
    
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            // new:true to return the modified document rather than the original
            runValidators: true
        });
    
        if(!doc) {
            return next(new AppError('NO document found with this ID!!', 404))
        };

        res.status(200).json({
            status: 'success',
            data: {
                data: doc
            }
        });
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
    // cosnt newTour = new Tour({});
    // newTour.save();
    // another way of creating document

const doc = await Model.create(req.body);
// using async await because Tour.create returns a promise

res.status(201).json({
    status: 'success',
    data: {
        data: doc
    }
  });
});

// Factory Functions:READING
exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {

    let query = Model.findById(req.params.id); // findById just for id in the data
    if(popOptions) query = query.populate(popOptions);

    const doc = await query;

        if(!doc) {
            return next(new AppError('NO document found with this ID!!', 404))
        };

        res.status(200).json({
            status: 'success',
            data: {
                data: doc
            }
        });
});

exports.getAll = Model => catchAsync(async (req, res, next) => {

    // to allow for Nested GET (endpoint) reviews on tour (hack)
    let filter = {};
    if(req.params.tourId) filter = { tour: req.params.tourId };

    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate(); //find query
    // retrun this --> helps to chain this methods
    // creating new APIFeatures class and passing a query obj (Tour.find())
    // then query string (req.query)
    // class methods used to manipulate query

    const doc= await features.query; 

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            // requestedAt: req.requestTime,
            results: doc.length,
            data: {
                data: doc
            }
        });
});
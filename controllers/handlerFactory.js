const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

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
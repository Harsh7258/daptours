const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

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
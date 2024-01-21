const User = require("../modals/userModal");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
    // ...allowedFields -- creates array containing all of the arguements that we passed in

    const newObj = {};

    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el]; // create new field in new object with same el

    }); // loops through object and checks if we passed in fields

    return newObj;
};


exports.createUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined! Use /signup instead.'
    });
};

// GET current user
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}; // /me middleware called before getOne midlleware

// UPDATE current user
exports.updateMe = catchAsync(async(req, res, next) => {
    //1. Create error if user POSTs password data
    if(req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword!!', 400));
    };
    
    //2. Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email'); // fields that are filtered from schema fields
    
    //3. UPDATE user document
    const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });
    
    res.status(200).json({
        status: 'success',
        data: {
            user: updateUser
        }
    });
});

// DELETE current user
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    
    res.status(204).json({
        status: 'success',
        data: null 
    });
})

// USERS hanlders
exports.getAllUsers = factory.getAll(User);
exports.getUsers = factory.getOne(User);

// Do NOT update passwords with this!!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

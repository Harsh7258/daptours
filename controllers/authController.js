const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../modals/userModal');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
   return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
} 

exports.signup = catchAsync(async (req, res, next) => {
    // const newUser = await User.create(req.body); // creates new users using body data

    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    }); // allow user to only put this data that are in this function

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

exports.login = catchAsync(async(req, res, next) => {
    const { email, password } = req.body;

    // 1. check if email and password exist
    if(!email || !password) {
       return next(new AppError('Please provide email and password!', 400));
    };

    // 2. check if user exists && password is correct 
    const user = await User.findOne({ email }).select('+password');
    // console.log(user);

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401)); // UNAUTHORIZED
    }

    // 3. if everything ok, send token to client
    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token
    });
});

// PROTECTING TOUR ROUTES
exports.protect = catchAsync(async (req, res, next) => {
    let token;

    // 1. getting token and check of its there
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; 
    };
    // console.log(token);

    if(!token) {
        return next(new AppError('You are not logged in! Please log in.', 401));
    };
    
    // 2. verifiction token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // using token to verify the user
    // console.log(decoded);

    // 3. check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) {
        return next(new AppError(
            'The user belonging to this token does no longer exists.', 401
        ));
    }; // if user delete the login id toekn deleted someone cant login to the same token

    // 4. check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please login again.', 401));
    };


    //GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next(); //leads to next middleware

}); // middleware

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'lead-guide'].role = 'user'

        if(!roles.includes(req.user.role)) {
            return next(new AppError('You dont have permission to perform this action', 403)); // forbidden status code 403
        };
        next();
    };
};
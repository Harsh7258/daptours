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
    }

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
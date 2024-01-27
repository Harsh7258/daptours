const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../modals/userModal');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const signToken = id => {
   return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true // helps to prevent manipulation of cookie in browser
    };
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = ture;

    // CREATING cookie 
    res.cookie('jwt', token, cookieOptions);
    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
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

    createSendToken(newUser, 201, res);
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
    createSendToken(user, 200, res);
});

exports.logout = (req, res, next) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({ status: 'success' });
}

// PROTECTING TOUR ROUTES
exports.protect = catchAsync(async (req, res, next) => {
    let token;

    // 1. getting token and check of its there
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; 
    } else if (req.cookies.jwt){
        token = req.cookies.jwt;
    }
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

// Only for rendered pages, no errors!!
exports.isLoggedIn= async (req, res, next) => {
    try {
        if (req.cookies.jwt){
            // 1. verify token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
    
            // 2. check if user still exists
            const currentUser = await User.findById(decoded.id);
            if(!currentUser) {
                return next();
            }; 
    
            // 3. check if user changed password after the token was issued
            if (currentUser.changedPasswordAfter(decoded.iat)) {
                 return next();
            };
    
            // THERE IS LOGGED IN USER
            res.locals.user = currentUser;
            return next(); //leads to next middleware
        }
    } catch (error) {
        return next();
    }
    next();
}; // middleware

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'lead-guide'].role = 'user'

        if(!roles.includes(req.user.role)) {
            return next(new AppError('You dont have permission to perform this action', 403)); // forbidden status code 403
        };
        next();
    };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1. GET user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if(!user) {
        return next(new AppError('There is no USER with this email address.', 404));
    };

    //2. Generate the random reset token 
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false }); // deactivate all the validator in our schema 

    //3. Send it to users EMAIL
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${resetToken}`;

    const message = `Forgot your password? Sumbit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forgot your password, please ignore this email!!`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (vaild only for 10min)',
            message
        });
    
        res.status(200).json({
            status: 'success',
            message: 'TOKEN sent to your email!!'
        });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Try again later!!', 500));
    }

});

exports.resetPassword = catchAsync(async (req, res, next) => {
    //1. Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } 
    });

    //2. If token has not expired, and there is user, set the new password
    if(!user) {
        return next(new AppError('Token is invalid or has expired!', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    //3. Update changedAtPasswordAt property for the user

    //4. Log the user in, send JWT
    createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async(req, res, next) => {
    //1. Get user form the collection
    const user = await User.findById(req.user.id).select('+password');

    //2. Check if POSTed current password is correct
    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current passowrd is wrong.', 401));
    };

    //3. If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    //4. Log user in, send JWT
    createSendToken(user, 201, res);
});
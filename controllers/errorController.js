const AppError = require('./../utils/appError');

// HANDLING INVALID DATABASE IDs
const handleCastErrorDB = err => {
    const message = `INVALID ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
    // converting mongoose error to OPERATIONAL error
};

// const handleDuplicateFields = err => {
//     const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
//     // console.log(value);
    
//     const message = `Duplicate field value: ${value}. Please enter another value!`;
//     return AppError(message, 400);
// };

const handleValidationError = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `INVAILD input data ${errors.join('. ')}`;
    return new AppError(message, 400);
};


// ERRORS DURING DEVELOPMENT AND PRODUCTION

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if(err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });

        // Programming or other unknown error: dont leak error details
    } else {
        // log error
        // console.error('ERROR', err);

        // send error meassage
        res.status(500).json({
            status: 'Error',
            message: 'Something went wrong!!'
        });
    };
};

// PROTECTING TOUR ROUTES

const handleJsonWebTokenError = () => new AppError('INVAILD JWT!!', 401);
const handleExpiredJWT = () => new AppError('JWT is expired!, Please Login Again.', 401);

module.exports = (err, req, res, next) => {
    // console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    
    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };

        if (error.name === 'CastError') error = handleCastErrorDB(error); 
        // if(error.code === 11000) error = handleDuplicateFields(error);
        if (error.name === 'ValidationError') error = handleValidationError(error);
        if(error.name === 'JsonWebTokenError') error = handleJsonWebTokenError();
        if(error.name === 'TokenExpiredError') error = handleExpiredJWT();

        sendErrorProd(error, res);
    };
};
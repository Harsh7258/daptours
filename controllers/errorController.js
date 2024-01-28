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

const sendErrorDev = (err, req, res) => {
    //API
    if(req.originalUrl.startsWith('/api')){
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        // rendered website
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!!',
            message: err.message
        });
    };
};

const sendErrorProd = (err, req, res) => {
    // 1. API
    if(req.originalUrl.startsWith('/api')){
        // Operational, trusted error: send message to client
        if(err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
            // 2. Programming or other unknown error: dont leak error details
        } 
            // log error
            // console.error('ERROR', err);
    
            // send error meassage
            return res.status(500).json({
                status: 'Error',
                message: 'Something went wrong!!'
            });
    }

    // RENDERED WEBSITE
    if(err.isOperational){
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!!',
            message: err.message
        });
        // Programming or other unknown error: dont leak error details
    }
        // 2. Send generic message
        return res.status(500).json({
            status: 'Error',
            message: 'Please try again later.'
        });
};

// PROTECTING TOUR ROUTES
const handleJsonWebTokenError = () => new AppError('INVAILD JWT!!', 401);
const handleExpiredJWT = () => new AppError('JWT is expired!, Please Login Again.', 401);

module.exports = (err, req, res, next) => {
    // console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    
    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;

        if (error.name === 'CastError') error = handleCastErrorDB(error); 
        // if(error.code === 11000) error = handleDuplicateFields(error);
        if (error.name === 'ValidationError') error = handleValidationError(error);
        if(error.name === 'JsonWebTokenError') error = handleJsonWebTokenError();
        if(error.name === 'TokenExpiredError') error = handleExpiredJWT();

        sendErrorProd(error, req, res);
    };
};
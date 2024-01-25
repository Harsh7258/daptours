const express = require("express");
const path = require('path'); // creates paths to the folders
const rateLimit = require('express-rate-limit'); 
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
// const  sanitizeHTML = require('sanitize-html');
const xss = require('xss-clean');
const morgan = require("morgan");
// function on calling add many methods the app function. 
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewsRouter = require('./routes/viewsRoutes');

const app = express();

// setting engine template PUG: { setting up pug in express }
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1. GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public'))); // .static --> serving static files

// Set security HTTP headers
app.use(helmet());

// Development Logging
if(!process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    // using 3rd party middleware
};

// Implementing Rate Limiting
const limiter = rateLimit({
    max: 47,
    windowMs: 60 * 60 * 1000,
    message: 'TOO many requests from this IP, Please try again in a hour!!'
}); // LIMITING IP requests form one users

app.use('/api', limiter); //middleware

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // sets middleware

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss()); // cross-site scripting protects from malicious HTML code(tags)

app.use(hpp({
    whitelist: [
        'duration',
        'ratingQuantity',
        'ratingAverage',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}));

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    next();
});

// ROUTE handlers
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// Route --> use for same URLs
// mounting multiple routes

// 3. ROUTES

app.use('/', viewsRouter);
app.use('/api/v1/tours', tourRouter); // tourRouter --> middleware function
app.use('/api/v1/users', userRouter); // userRouter --> middleware function
app.use('/api/v1/reviews', reviewRouter); // reviewRouter --> middleware function 

// HANDLING UNHANDLED ROUTES
app.all('*', (req, res, next) => {
     next(new AppError(`Cant find ${req.originalUrl} on this server!!`, 404)); // anything pass on next it will automatic directed to the error middleware

});

// BETTER ERRORS and REFACTORING
app.use(globalErrorHandler);

// 4. START SERVER
module.exports = app;
const express = require("express");
const morgan = require("morgan");
// function on calling add many methods the app function. 

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

if(!process.env.NODE_ENV === 'development') {
    // 1. MIDDLEWARES
    app.use(morgan('dev'));
    // using 3rd party middleware
}

app.use(express.json());
// sets middleware 

app.use(express.static(`${__dirname}/public`));
// .static --> serving static files

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
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
app.use('/api/v1/tours', tourRouter); // tourRouter --> middleware function
app.use('/api/v1/users', userRouter); // userRouter --> middleware function

// HANDLING UNHANDLED ROUTES
app.all('*', (req, res, next) => {
     next(new AppError(`Cant find ${req.originalUrl} on this server!!`, 404)); // anything pass on next it will automatic directed to the error middleware

});

// BETTER ERRORS and REFACTORING
app.use(globalErrorHandler);

// 4. START SERVER
module.exports = app;
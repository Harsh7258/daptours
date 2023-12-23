const mongoose = require("mongoose");

const dotenv = require('dotenv');

// UNCAUGHT EXCEPTIONS
process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION shuting down....');
        process.exit(1); 

});

dotenv.config({path: './config.env'});

const app = require('./app');

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    // console.log(con.connections);
    // logs all connections details
    console.log('DB connected!!');
});

// console.log(app.get('env'));
// console.log(process.env); 

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App in running on the ${port}...`);
})
// callback function that will be called as soon as server is start listening

// Errors Outside Express: Unhandled Rejections
process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION shuting down....');
    server.close(() => {
        process.exit(1); // 1 stand for uncaught exception

        // 0 for success
    }); // giving time to finish all the request to handled and then closed

}); // for database connection error
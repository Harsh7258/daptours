const fs = require("fs");
const mongoose = require("mongoose");
const Tour = require("../../modals/tourModal");
const User = require("../../modals/userModal");
const Review = require("../../modals/reviewModal");
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

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

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
// converting JSON file into object 
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false }); // all of the validation in user are skipped
        await Review.create(reviews);
        // create new documents for the eah object in the array

        console.log('Data successfully loaded!!');
        
    } catch (error) {
        console.log(error);
    };
    process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data successfully deleted!!');
        
    } catch (error) {
        console.log(error);
    };
    process.exit();
};

if(process.argv[2] === '--import'){
    importData();
} else if(process.argv[2] === '--delete'){
    deleteData();
}
// console.log(process.argv);

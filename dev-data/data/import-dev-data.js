const fs = require("fs");
const mongoose = require("mongoose");
const Tour = require("../../modals/tourModal");
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
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));
// converting JSON file into object 

// IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Tour.create(tours);
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

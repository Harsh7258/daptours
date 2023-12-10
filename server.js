const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const app = require('./app');

// console.log(app.get('env'));
// console.log(process.env); 

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App in running on the ${port}...`);
})
// callback function that will be called as soon as server is start listening
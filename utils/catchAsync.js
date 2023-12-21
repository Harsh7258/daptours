module.exports = fn => {
    return (req, res, next) => { // anonymous function assigned to every tour functions
        
        fn(req, res, next).catch(next); // catches the any errors and promises
        
    }; // function should have same paramaters which they are passed on
};
// to get rid of try catch block 
// wrapped asynchronous function inside this catchAsync function -- 
// this function will then return a new anonymous function


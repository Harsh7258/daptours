const Tour = require('./../modals/tourModal');

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// 2. ROUTE HANDLERS or CONTROLLERS
// route handler --> in express terms

exports.checkBody = (req, res, next) => {
    if(!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'FAIL',
            message: 'Missing name or price'
        });
    };
    next();
};

// TOURS
exports.getAllTours = (req, res) => {

    console.log(req.params);
    console.log(req.requestTime);

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        // results: tours.length,
        // data: {
        //     tours
        // }
    });
};

exports.getTour = (req, res) => {

    console.log(req.params);

    const id = req.params.id * 1;
    // to convert any string into number multiply it with number.

    // const tour = tours.find(el => el.id === id);
    // // find --> array method to find data according to the ID (:id/5... or any number)

    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         tour
    //     }
    // });
}

exports.createTour = (req, res) => {
    res.status(201).json({
        status: 'success',
        // data: {
        //     tour: newTour
        // }
    });
};

exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    })
};

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null
    })
};
const Tour = require('./../modals/tourModal');

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// 2. ROUTE HANDLERS or CONTROLLERS
// route handler --> in express terms

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

exports.createTour = async (req, res) => {
    try {
        // cosnt newTour = new Tour({});
        // newTour.save();
        // another way of creating document

    const newTour = await Tour.create(req.body);
    // using async await because Tour.create returns a promise

    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    });
    } catch (error) {
        res.status(400).json({
            status: 'Failed',
            message: error
        })
    }
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
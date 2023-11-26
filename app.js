const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
// function on calling add many methods the app function. 

const app = express();

// 1. MIDDLEWARES
app.use(morgan('dev'));
// using 3rd party middleware

app.use(express.json());
// sets middleware 

app.use((req, res, next) => {
    console.log('Hello midlleware!!');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// 2. ROUTE HANDLERS
const getAllTours = (req, res) => {

    console.log(req.params);
    console.log(req.requestTime);

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    });
};

const getTour = (req, res) => {

    console.log(req.params);

    const id = req.params.id * 1;
    // to convert any string into number multiply it with number.

    const tour = tours.find(el => el.id === id);
    // find --> array method to find data according to the ID (:id/5... or any number)

    if(!tour) {
        return res.status(404).json({
            status: 'Fail',
            message: 'Invalid ID'
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
}

const createTour = (req, res) => {
    // console.log(req.body);
    // res.send('done');

    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);

    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });
};

const updateTour = (req, res) => {

    if(req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'Fail',
            message: 'Invalid ID'
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    })
};

const deleteTour = (req, res) => {

    if(req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'Fail',
            message: 'Invalid ID'
        })
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
};

// route handler --> in express terms
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// Route --> use for same URLs
// 3. ROUTES
app
.route('/api/v1/tours')
.get(getAllTours)
.post(createTour);

app
.route('/api/v1/tours/:id')
.get(getTour)
.patch(updateTour)
.delete(deleteTour);

// 4. START SERVER
const port = 3000;
app.listen(port, () => {
    console.log(`App in running on the ${port}...`);
})
// callback function that will be called as soon as server is start listening
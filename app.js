const fs = require('fs');
const express = require('express');
// function on calling add many methods the app function. 

const app = express();

app.use(express.json());
// sets middleware 

// app.get('/', (req, res) => {
//     res.status(200).json({message:'Hello from the API!!', app: 'daptours'});
//     // in the format of json on the server.
// });
// get(read) request on the server on this URL '/'

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// route handler --> in express terms
app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
});

app.post('/api/v1/tours', (req, res) => {
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
});

// app.post('/', (req, res) => {
//     res.send('you can post to this endpoint...')
// });
// post(create) request on server on same URL '/'

const port = 3000;
app.listen(port, () => {
    console.log(`App in running on the ${port}...`);
})
// callback function that will be called as soon as server is start listening
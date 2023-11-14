const express = require('express');
// function on calling add many methods the app function. 

const app = express();

app.get('/', (req, res) => {
    res.status(200).json({message:'Hello from the API!!', app: 'daptours'});
    // in the format of json on the server.
});
// get request on the server on this URL '/'

app.post('/', (req, res) => {
    res.send('you can post to this endpoint...')
});
// post request on server on same URL '/'

const port = 3000;
app.listen(port, () => {
    console.log(`App in running on the ${port}...`);
})
// callback function that will be called as soon as server is start listening
const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have name'],
        // validator

        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    }
});
// mongoose.Schema to specify a schema for data

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
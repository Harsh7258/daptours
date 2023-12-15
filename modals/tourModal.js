const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have name'],
        // validator

        unique: true,
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'Trip duration is required!']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have duration']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have difficulty']
    },
    ratingaAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date]
});
// mongoose.Schema to specify a schema for data

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
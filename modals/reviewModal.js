const mongoose = require('mongoose');

// Modelling Reviews: Parent refenrcing -- using ref: { Tour, User } parents of reviewSchema in data modelling
const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review cannot be empty']
    },
    rating: {
        type: Number,
        min: 1,
        max:5
    },
    createdAt: {
        type: Date,
        default: Date.now()        
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour.']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user.']
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
    // when we have virtual property bascially a field that is not stored in the database but calcalated using other value (shows up whenever there is output)
});

const Review = new mongoose.model('Review', reviewSchema);

module.exports = Review;
const mongoose = require('mongoose');
const Tour = require('./tourModal');

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

// Preventing duplicate REVIEWS
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// QUERY middleware
// find hook -- to find strings start with { find } works for find, findOne, findOneById and more
reviewSchema.pre(/^find/, function(next) {
    // this.populate({
    //     path: 'tour',
    //     select: 'name'
    // }).populate({
    //     path: 'user',
    //     select: 'name photo'
    // });
    this.populate({
        path: 'user',
        select: 'name photo'
    });

    next();
});

reviewSchema.statics.calcAverageRatings = async function(tourId) {
    // creating statics review for tourId

    // console.log(tourId)
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    // console.log(stats);

    // updating review statics to the tourId 
    if(stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        });
    };
};

// in order to use this function after review is created { post } is used
reviewSchema.post('save', function() {
    // this points to current review model
    this.constructor.calcAverageRatings(this.tour);
});

// findByIdAndUpadate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function(next){
    this.r = await this.findOne(); // storing in this.r
    // console.log(this.r);
    next();
});
// passing the data between pre to post middleware using { this.r }
reviewSchema.post(/^findOneAnd/, async function(){
    // await this.findOne(); does not work here, query has already executed
    await this.r.constructor.calcAverageRatings(this.r.tour);
    // retrive the review document from this
});

const Review = new mongoose.model('Review', reviewSchema);

module.exports = Review;
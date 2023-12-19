const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have name'],
        // validator

        unique: true,
        trim: true
    },
    slug: String,
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
    ratingsAverage: {
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
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// mongoose.Schema to specify a schema for data

// VIRTUAL PROPERTIES
tourSchema.virtual('duratinInWEEKS').get(function() {
    return this.duration / 7;
    // using simple function because it supports this keyword that arrow func cant
}); 

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function(next){
    // 'save is hook here
    // console.log(this);

    this.slug = slugify(this.name, { lower: true });
    next(); // without next request will get stuck

}); // pre save hook

// QUERY MIDDLEWARE
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function(next) {
    // find hook
    this.find({ secretTour: { $ne: true } });

    this.start = Date.now();
    next();
}); // query can be visible in database but not in postman beacuse secretTour is filtered out

tourSchema.post(/^find/, function(docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!!`);
    // console.log(docs);
    next();
});

// AGGREGATE MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
    
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    console.log(this.pipeline());
    next();
}); // hides the secretTour from tour-stats

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
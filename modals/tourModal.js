const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
// const User = require("./userModal");

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have name'],
        // validator

        unique: true,
        trim: true,
        maxLength: [30, 'Name is longer than 30 letters!!'],
        minLength: [5, 'Name is smaller than 5 letters!!'],
        // validate: validator.isAlpha 
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
        required: [true, 'A tour must have difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: EASY, MEDIUM, DIFFICULTY'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val) {
                // this only points to current doc on NEW document creation
                return val < this.price;
            }
        },
        message: 'Discount price ({ VALUE }) should be below regular price'
    }, 
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
    },
    startLocation: {
        // GeoJSON for geosaptial loactions in mongoDB
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        address: String,
        description: String,
        coordinates: [Number]
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            address: String,
            description: String,
            day: Number,
            coordinates: [Number]
        }
    ], // we always need to use this array, array of objects
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User' // setting refrences between datasets
        }
    ]
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
    // when we have virtual property bascially a field that is not stored in the database but calcalated using other value (shows up whenever there is output)
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

// tourSchema.pre('save', async function(next) {
//     const guidesPromises = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(guidesPromises);

//     next();
// });

// QUERY MIDDLEWARE
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function(next) {
    // find hook
    this.find({ secretTour: { $ne: true } });

    this.start = Date.now();
    next();
}); // query can be visible in database but not in postman beacuse secretTour is filtered out

tourSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'guides',
        select: '-__v -__passwordChangedAt'
    });

    next();
});

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
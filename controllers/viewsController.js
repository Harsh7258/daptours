const Tour = require('./../modals/tourModal');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('../modals/userModal');

exports.getOverview = catchAsync(async (req, res) => {
    // 1. Get tour data from collection
    const tours = await Tour.find();

    // 2. Build template

    // 3. Render that template using tour data form (1).
    res.status(200).render('overview', {
        title: 'All tours',
        tours
    }); // .render the template { base.pug }
}); // for rendering pages
exports.getTour = catchAsync( async(req, res, next) => {
    // 1. 
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({ 
        path: 'reviews',
        fields: 'user ratings review'
     });

     if(!tour) {
        return next(new AppError('There is no tour with this name.', 404))
     }

    res.status(200).set(
        'Content-Security-Policy',
        "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
      ).render('tour', {
        title: `${tour.name} Tour`,
        tour
    });
});

exports.logIn = (req, res) => {
    res.status(200).render( 'logIn',{
        title: 'Login to your account'
    });
};
exports.signUp = (req, res) => {
    res.status(200).render( 'signUp',{
        title: 'Login to your account'
    });
};

// BUILDING the USER account page
exports.getAccount = (req, res) => {
    res.status(200).render( 'account',{
        title: 'Your Account'
    });
};

// UPDATING USER DATA
exports.updateUserData = catchAsync(async (req, res, next) => {
    const updateUser = await User.findByIdAndUpdate(req.body.id, {
        name: req.body.name,
        email: req.body.email
    },
    {
        new: true,
        runValidators: true
    });

    res.status(200).render( 'account',{
        title: 'Your Account',
        user: updateUser
    });

    console.log('UPDATING USER DATA', req.body);
});
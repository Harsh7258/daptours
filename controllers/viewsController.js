const Tour = require('./../modals/tourModal');
const catchAsync = require('./../utils/catchAsync');

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
exports.getTour = catchAsync( async(req, res) => {
    // 1. 
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({ 
        path: 'reviews',
        fields: 'user ratings review'
     });
    res.status(200) .set(
        'Content-Security-Policy',
        "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
      ).render('tour', {
        title: `${tour.name} Tour`,
        tour
    });
});
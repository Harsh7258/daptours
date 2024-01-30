const multer = require('multer');
const sharp = require('sharp');
const User = require("../modals/userModal");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require('./handlerFactory');

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename =  `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/img/users/${req.file.filename}`);

    next();
});

const filterObj = (obj, ...allowedFields) => {
    // ...allowedFields -- creates array containing all of the arguements that we passed in

    const newObj = {};

    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el]; // create new field in new object with same el

    }); // loops through object and checks if we passed in fields

    return newObj;
};


exports.createUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined! Use /signup instead.'
    });
};

// GET current user
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}; // /me middleware called before getOne midlleware

// UPDATE current user
exports.updateMe = catchAsync(async(req, res, next) => {
    // console.log(req.file);
    // console.log(req.body); // logs image properties

    //1. Create error if user POSTs password data
    if(req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword!!', 400));
    };
    
    //2. Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email'); // fields that are filtered from schema fields

    if(req.file) filteredBody.photo = req.file.filename;
    
    //3. UPDATE user document
    const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });
    
    res.status(200).json({
        status: 'success',
        data: {
            user: updateUser
        }
    });
});

// DELETE current user
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    
    res.status(204).json({
        status: 'success',
        data: null 
    });
})

// USERS hanlders
exports.getAllUsers = factory.getAll(User);
exports.getUsers = factory.getOne(User);

// Do NOT update passwords with this!!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

// Route --> use for same URLs
// 3. ROUTES

const router = express.Router();
// ROUTER middleware 

router.post('/signup', authController.signup); // route to create new user
router.post('/login', authController.login); // route to create login

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Portect all routes after this middleware
router.use(authController.protect); // PROTECT middleware used for login

router.patch('/updateMyPassword', authController.updatePassword);
router.route('/me').get( userController.getMe, userController.getUsers);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

router
.route('/')
.get(userController.getAllUsers)
.post(userController.createUsers);

router
.route('/:id')
.get(userController.getUsers)
.patch(userController.updateUser)
.delete( userController.deleteUser);

module.exports = router;

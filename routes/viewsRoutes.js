const express = require('express');
const authController = require('./../controllers/authController');
const viewsController = require('./../controllers/viewsController');


const router = express.Router();

// Extending our base template with BLOCKS
router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.logIn);
router.get('/signup', authController.isLoggedIn, viewsController.signUp);
router.get('/me', authController.protect, viewsController.getAccount);

router.post('/submit-user-data', authController.protect, viewsController.updateUserData);


module.exports = router;
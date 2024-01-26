const express = require('express');
const authController = require('./../controllers/authController');
const viewsController = require('./../controllers/viewsController');


const router = express.Router();

router.use(authController.isLoggedIn);

// Extending our base template with BLOCKS
router.get('/', viewsController.getOverview);
router.get('/tour/:slug', viewsController.getTour);
router.get('/login', viewsController.logIn);
router.get('/signup', viewsController.signUp);

module.exports = router;
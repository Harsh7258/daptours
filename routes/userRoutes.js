const express = require('express');
const userController = require('./../controllers/userController');

// Route --> use for same URLs
// 3. ROUTES

const router = express.Router();
// ROUTER middleware 

router
.route('/')
.get(userController.getAllUsers)
.post(userController.createUsers);

router
.route('/:id')
.get(userController.getUsers)
.patch(userController.updateUser)
.delete(userController.deleteUser);

module.exports = router;

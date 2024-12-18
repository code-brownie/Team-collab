const express = require('express');
const userController = require('../controllers/auth/Usercontroller')
const { signUp, signIn } = userController;

const userAuth = require('../middleware/UserAuth');

const router = express.Router();

//signUp route
router.post('/signUp', userAuth.saveUser, signUp);

//signIn route
router.post('/signIn', signIn);

module.exports = router;
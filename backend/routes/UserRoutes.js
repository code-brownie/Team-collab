const express = require('express');
const userController = require('../controllers/auth/Usercontroller')
const { signUp, signIn, getAllUser, getUserProjects } = userController;

const userAuth = require('../middleware/UserAuth');

const router = express.Router();

//signUp route
router.post('/signUp', userAuth.saveUser, signUp);

//signIn route
router.post('/signIn', signIn);
// All user router
router.get('/all', getAllUser);

router.get('/getProjects', getUserProjects);

module.exports = router;
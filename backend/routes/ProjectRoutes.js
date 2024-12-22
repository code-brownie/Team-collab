const express = require('express');
const Projectcontroller = require('../controllers/project/ProjectController');
const { CreateProject, GetProjectById } = Projectcontroller;

const router = express.Router();

router.post('/create', CreateProject);
router.get('/getOne', GetProjectById);

module.exports = router;
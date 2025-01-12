const express = require('express');
const Projectcontroller = require('../controllers/project/ProjectController');
const { CreateProject, GetProjectById, AddUserToProject, GetAllProjects } = Projectcontroller;

const router = express.Router();

router.post('/create', CreateProject);
router.get('/getOne', GetProjectById);
router.post('/addUsertoProject', AddUserToProject);
router.get('/getMany/:userId', GetAllProjects);

module.exports = router;
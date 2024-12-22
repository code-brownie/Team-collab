const express = require('express');
const Projectcontroller = require('../controllers/project/ProjectController');
const { CreateProject, GetProjectById, AddUserToProject } = Projectcontroller;

const router = express.Router();

router.post('/create', CreateProject);
router.get('/getOne', GetProjectById);
router.post('/addUsertoProject', AddUserToProject);

module.exports = router;
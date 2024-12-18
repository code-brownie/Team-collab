const express = require('express');
const Projectcontroller = require('../controllers/project/ProjectController');
const { CreateProject } = Projectcontroller;

const router = express.Router();

router.post('/create', CreateProject);

module.exports = router;
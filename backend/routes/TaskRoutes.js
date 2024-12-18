const express = require('express');
const Taskcontroller = require('../controllers/Task/TaskController');
const { createTask } = Taskcontroller;

const router = express.Router();

router.post('/createTask', createTask);

module.exports = router;
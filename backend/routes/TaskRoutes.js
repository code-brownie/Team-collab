const express = require('express');
const Taskcontroller = require('../controllers/Task/TaskController');
const { createTask, AllTask, TaskByUser, UpdateTask, getTaskById } = Taskcontroller;

const router = express.Router();

router.post('/createTask', createTask);
router.get('/allTask', AllTask);
router.get('/taskforUser', TaskByUser);
router.get('/getTaskById', getTaskById);
router.put('/updateTask', UpdateTask);

module.exports = router;
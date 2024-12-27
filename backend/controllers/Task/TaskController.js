const { where } = require("sequelize");
const Project = require("../../models/Project");
const Task = require("../../models/Task");
const TeamUser = require('../../models/TeamUser');

// Create the Task
const createTask = async (req, res) => {
    const { title, description, assignedId, projectId, deadline, status, priority } = req.body;
    console.log(req.body);
    try {
        if (!title || !description || !assignedId || !projectId) {
            return res.status(400).json({ Message: 'Please enter all the fields' });
        }
        if (title.length > 100) {
            return res.status(400).json({ Message: 'Title cannot exceed more than 100 chars' })
        }
        // check if the project exist
        const ifProjectExist = await Project.findByPk(projectId);
        if (!ifProjectExist) {
            return res.status(400).json({ Message: 'Project does not exist' })
        }
        // Check if the assignedUser in the team of that project
        const isUserInTeam = await TeamUser.findOne({
            where: {
                UserId: assignedId,
                TeamId: ifProjectExist.teamId
            }
        })
        if (!isUserInTeam) {
            return res.status(400).json({ Message: 'Assigned User is not a part of Project' });
        } else {
            const task_data = {
                title,
                description,
                assignedUserId: assignedId,
                projectId,
                deadline,
                status, priority
            }
            const newTask = await Task.create(task_data);
            return res.status(201).json({ Task: newTask, Message: 'Task Created' })
        }

    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Error creating Task');
    }
};
const AllTask = async (req, res) => {
    const { id } = req.query;
    try {
        if (!id) {
            return res.status(404).send('Please provide the project Id');
        }
        const allTask = await Task.findAll({
            where: {
                projectId: id
            }
        });
        if (!allTask) return res.status(404).send('No Task found');
        return res.status(201).json({ Task: allTask });
    } catch (error) {
        return res.status(500).send('Internal server error');
    }
}
const TaskByUser = async (req, res) => {
    const { id, UserId } = req.query;
    try {
        if (!id || !UserId) {
            return res.status(404).send('Please provide the project Id or UserId');
        }
        const allTask = await Task.findAll({
            where: {
                projectId: id,
                assignedUserId: UserId
            }
        });
        if (!allTask) return res.status(404).send('No Task found');
        return res.status(201).json({ Task: allTask });
    } catch (error) {
        return res.status(500).send('Internal server error');
    }
}
const UpdateTask = async (req, res) => {
    const { status, id } = req.body;
    console.log(req.body);
    try {
        if (!id || !status) return res.status(404).send('Please provide task status or task id');
        const updatedTask = await Task.update(
            { status: status }, {
            where: {
                id: id
            }
        });
        console.log(updatedTask);
        return res.status(201).json({updatedTask});
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Internal server error');
    }
}
module.exports = { createTask, AllTask, TaskByUser,UpdateTask };

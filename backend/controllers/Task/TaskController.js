const Project = require("../../models/Project");
const Task = require("../../models/Task");
const TeamUser = require('../../models/TeamUser');

// Create the Task
const createTask = async (req, res) => {
    const { title, description, assignedId, projectId } = req.body;

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
            // Create the Task
            const task_data = {
                title,
                description,
                assignedUserId: assignedId,
                projectId
            }
            const newTask = await Task.create(task_data);
            return res.status(201).json({ Task: newTask, Message: 'Task Created' })
        }

    } catch (error) {
        console.log(error.Message);
        return res.status(500).send('Error creating Task');
    }
};

module.exports = {createTask};

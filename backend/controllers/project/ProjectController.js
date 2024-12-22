const Project = require('../../models/Project');
const User = require('../../models/User');

const CreateProject = async (req, res) => {
    const { name, teamId, description, deadline } = req.body;
    console.log(deadline);
    try {
        // check for existing project within same team
        const ifProjectExist = await Project.findOne({
            where: {
                name: name,
                teamId: teamId
            }
        });
        if (ifProjectExist) {
            return res.status(409).json({ message: 'Project already exists' })
        }
        // create a new Project
        else {
            const project_data = {
                name,
                description,
                teamId,
                deadline
            };
            const newProject = await Project.create(project_data);
            return res.status(201).json({ project: newProject, message: 'Project created' });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Error creating project');
    }
};

const GetProjectById = async (req, res) => {
    const { projectId } = req.query;
    console.log('the id', projectId);
    if (!projectId) {
        return res.status(400).json({ error: "Project ID is required." });
    }

    try {
        const project = await Project.findByPk(projectId);

        if (!project) {
            return res.status(404).json({ error: "Project not found." });
        }
        return res.status(200).json({ project });
    } catch (error) {
        console.error("Error fetching project by ID:", error.message);
        return res.status(500).json({ error: "Internal server error." });
    }
};

const AddUserToProject = async (req, res) => {
    const { userId, projectId } = req.body;
    if (!userId || !projectId) return res.status(404).send('Missing userId or ProjectId');
    try {

        const user = await User.findByPk(userId);
        const project = await Project.findByPk(projectId);

        if (user && project) {
            await user.addProject(project, {
                through: {
                    dateJoined: new Date(),
                },
            });
            console.log(`${user.name} added to project ${project.name}`);
            return res.status(201).json({ message: 'User added to project' })
        } else {
            console.log('user or project not found!!');
            return res.status(404).json({ message: 'User or Project not found' });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal server Error');
    }
}

module.exports = { CreateProject, GetProjectById, AddUserToProject };
const Project = require('../../models/Project');

const CreateProject = async (req, res) => {
    const { name, teamId, description } = req.body;
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
                teamId
            };
            const newProject = await Project.create(project_data);
            return res.status(201).json({ project: newProject, message: 'Project created' });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Error creating project');
    }
};

module.exports = { CreateProject };
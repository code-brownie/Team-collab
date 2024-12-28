const Project = require('../../models/Project');
const User = require('../../models/User');
const TeamUser = require('../../models/TeamUser');
const Team = require('../../models/Team');
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
    if (!projectId) {
        return res.status(400).json({ error: "Project ID is required." });
    }

    try {
        const project = await Project.findByPk(projectId, {
            include: [
                {
                    model: Team,
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name', 'email'],
                            through: {
                                attributes: ['role'],
                            },
                        },
                    ],
                }
            ]
        });

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
    const { userIds, projectId } = req.body;

    if (!userIds || !projectId) {
        return res.status(400).send('Missing userIds or projectId');
    }

    try {
        const project = await Project.findByPk(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const users = await User.findAll({
            where: {
                id: userIds,
            },
        });

        if (!users.length) {
            return res.status(404).json({ message: 'No users found' });
        }

        await Promise.all(
            users.map((user) =>
                user.addProject(project, {
                    through: { dateJoined: new Date() },
                })
            )
        );

        console.log(`Users added to project ${project.name}`);
        return res.status(201).json({ message: 'Users added to project' });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
}

module.exports = { CreateProject, GetProjectById, AddUserToProject };
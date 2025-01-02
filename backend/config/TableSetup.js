const sequelize = require("./db");
const Project = require("../models/Project");
const Task = require("../models/Task");
const Team = require("../models/Team");
const TeamUser = require("../models/TeamUser");
const User = require("../models/User");
const UserProjects = require("../models/UserProjects");
const File = require("../models/File");


User.belongsToMany(Team, { through: TeamUser, foreignKey: 'UserId' });
Team.belongsToMany(User, { through: TeamUser, foreignKey: 'TeamId' });
Team.hasMany(Project, { foreignKey: 'teamId' });
Project.belongsTo(Team, { foreignKey: 'teamId' });
Project.hasMany(Task, { foreignKey: 'projectId' });
Task.belongsTo(Project, { foreignKey: 'projectId' });
User.hasMany(Task, { foreignKey: 'assignedUserId' });
Task.belongsTo(User, { foreignKey: 'assignedUserId' });
User.belongsToMany(Project, {
    through: UserProjects, foreignKey: 'userId', otherKey: 'projectId'
});
Project.belongsToMany(User, {
    through: UserProjects, foreignKey: 'projectId', otherKey: 'userId'
});

Team.hasMany(File, { foreignKey: 'teamId' });
File.belongsTo(Team, { foreignKey: 'teamId' });

User.hasMany(File, { 
    foreignKey: 'uploadedBy',
    as: 'UploadedFiles'
});
File.belongsTo(User, { 
    foreignKey: 'uploadedBy',
    as: 'Uploader'
});

async function initializeDatabase() {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully!');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
}

module.exports = initializeDatabase;

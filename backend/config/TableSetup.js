const sequelize = require("./db");
const Project = require("../models/Project");
const Task = require("../models/Task");
const Team = require("../models/Team");
const TeamUser = require("../models/TeamUser");
const User = require("../models/User");


User.belongsToMany(Team, { through: TeamUser, foreignKey: 'UserId' });
Team.belongsToMany(User, { through: TeamUser, foreignKey: 'TeamId' });
Team.hasMany(Project, { foreignKey: 'teamId' });
Project.belongsTo(Team, { foreignKey: 'teamId' });
Project.hasMany(Task, { foreignKey: 'projectId' });
Task.belongsTo(Project, { foreignKey: 'projectId' });
User.hasMany(Task, { foreignKey: 'assignedUserId' });
Task.belongsTo(User, { foreignKey: 'assignedUserId' });

async function initializeDatabase() {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully!');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
}

module.exports = initializeDatabase;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserProjects = sequelize.define('UserProjects', {
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Projects',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    dateJoined: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
});

module.exports = UserProjects;

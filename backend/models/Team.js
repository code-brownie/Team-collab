const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Team = sequelize.define('Team', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
    },
    joinCode: {
        type: DataTypes.STRING(8),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            len: [6, 8]
        }
    }
});

module.exports = Team;
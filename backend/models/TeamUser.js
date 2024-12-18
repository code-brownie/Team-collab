const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TeamUser = sequelize.define('TeamUser', {
    role: {
        type: DataTypes.ENUM('Admin', 'Member'),
        defaultValue: 'Member',
    },
});

module.exports = TeamUser;

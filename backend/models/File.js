const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');
const File = sequelize.define('File', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    fileName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fileType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fileSize: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cloudinaryUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cloudinaryPublicId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    uploadedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    teamId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Teams',
            key: 'id'
        }
    }
});

module.exports = File;
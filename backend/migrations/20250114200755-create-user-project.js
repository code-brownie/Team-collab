'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserProjects', {
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      projectId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Projects',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      dateJoined: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Add unique constraint
    await queryInterface.addConstraint('UserProjects', {
      fields: ['userId', 'projectId'],
      type: 'unique',
      name: 'unique_user_project'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserProjects');
  }
};

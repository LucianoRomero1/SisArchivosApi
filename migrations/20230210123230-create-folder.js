'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Folders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      folderNumber: {
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      dateTo: {
        type: Sequelize.DATE
      },
      stateId: {
        type: Sequelize.INTEGER,
      },
      boxId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Folders');
  }
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Boxes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      boxNumber: {
        type: Sequelize.INTEGER
      },
      column: {
        type: Sequelize.TINYINT
      },
      floor: {
        type: Sequelize.TINYINT
      },
      numberFrom: {
        type: Sequelize.INTEGER
      },
      numberTo: {
        type: Sequelize.INTEGER
      },
      observation: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.TINYINT
      },
      dateFrom: {
        type: Sequelize.DATE
      },
      dateTo: {
        type: Sequelize.DATE
      },
      areaId: {
        type: Sequelize.INTEGER
      },
      sideId: {
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
    await queryInterface.dropTable('Boxes');
  }
};
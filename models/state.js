'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class State extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      State.hasMany(models.Box, {
        as: "boxes",
        foreignKey: "stateId",
        onDelete: "CASCADE",
      });

      State.hasMany(models.Folder, {
        as: "folders",
        foreignKey: "stateId",
        onDelete: "CASCADE",
      });

      State.hasMany(models.Movement, {
        as: "movements",
        foreignKey: "stateId",
        onDelete: "CASCADE",
      });
    }
  }
  State.init({
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'State',
  });
  return State;
};
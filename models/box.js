"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Box extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Box.belongsTo(models.Area, {
        as: "area",
        foreignKey: "areaId",
      });
      Box.belongsTo(models.Side, {
        as: "side",
        foreignKey: "sideId",
      });
      Box.belongsTo(models.State, {
        as: "state",
        foreignKey: "stateId",
      });
      Box.hasMany(models.Folder, {
        as: "folders",
        foreignKey: "boxId",
      });
    }
  }
  Box.init(
    {
      title: DataTypes.STRING,
      boxNumber: DataTypes.INTEGER,
      column: DataTypes.TINYINT,
      floor: DataTypes.TINYINT,
      numberFrom: DataTypes.INTEGER,
      numberTo: DataTypes.INTEGER,
      observation: DataTypes.STRING,
      dateFrom: DataTypes.DATE,
      dateTo: DataTypes.DATE,
      areaId: DataTypes.INTEGER,
      sideId: DataTypes.INTEGER,
      stateId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "Box",
    }
  );
  return Box;
};

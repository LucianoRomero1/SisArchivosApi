"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Movement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Movement.belongsTo(models.Employee, {
        as: "employee",
        foreignKey: "employeeId",
      });

      Movement.belongsTo(models.Folder, {
        as: "folder",
        foreignKey: "folderId",
      });
    }
  }
  Movement.init(
    {
      state: DataTypes.TINYINT,
      withdrawalDate: DataTypes.DATE,
      returnDate: DataTypes.DATE,
      folderId: DataTypes.INTEGER,
      employeeId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Movement",
    }
  );
  return Movement;
};

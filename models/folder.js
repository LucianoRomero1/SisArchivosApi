"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Folder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Folder.belongsTo(models.Box, {
        as: "box",
        foreignKey: "boxId",
      });

      Folder.belongsTo(models.State, {
        as: "state",
        foreignKey: "stateId",
      });

      Folder.hasMany(models.Movement, {
        as: "movements",
        foreignKey: "folderId",
        onDelete: "CASCADE",
      })
    }
  }
  Folder.init(
    {
      folderNumber: DataTypes.INTEGER,
      title: DataTypes.STRING,
      dateTo: DataTypes.DATE,
      stateId: DataTypes.INTEGER,
      boxId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Folder",
    }
  );
  return Folder;
};

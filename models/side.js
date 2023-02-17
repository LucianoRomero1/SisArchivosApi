"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Side extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Side.hasMany(models.Box, {
        as: "boxes",
        foreignKey: "sideId",
        onDelete: "CASCADE",
      });
    }
  }
  Side.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Side",
    }
  );
  return Side;
};

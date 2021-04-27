'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class holding extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  holding.init({
    user_id: DataTypes.INTEGER,
    ticker: DataTypes.STRING,
    latest_price: DataTypes.FLOAT,
    holding_size: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'holding',
  });
  return holding;
};
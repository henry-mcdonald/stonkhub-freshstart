'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user.init({
    email: DataTypes.STRING,
    hashedpassword: DataTypes.STRING,
    accountvalue: DataTypes.FLOAT,
    cashvalue: DataTypes.FLOAT,
    profile: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};
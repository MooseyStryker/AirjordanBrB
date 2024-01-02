'use strict';
const {
  Model,
  Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER.BOOLEAN,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1,60]
      }
    },
    about: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1,50]
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        twoOptions(value){
          if (value !== 'Online' || 'In person') {
            throw new Error("Type must be 'Online' or 'In person'")
          }
        }
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate:{
        isBoolean(value){
          if (value != true || false){
            throw new Error('Private must be a boolean')
          }
        }
      }
    },
    city: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    state: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    numMembers: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    previewImage: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};

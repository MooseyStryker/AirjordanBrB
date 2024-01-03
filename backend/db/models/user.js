'use strict';
const {
  Model,
  Validator,
  Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Group, {
        as: 'Oranizer',
        foreignKey: 'organizerId',
        onDelete: 'CASCADE',
        hooks: true
      }),

      User.hasMany(models.Membership, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true
      }),

      User.hasMany(models.Attendence, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true
      })
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        len:[4,30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) throw new Error("Cannot be an email.");
        }
      }
    },
    email: {
      type: DataTypes.STRING(256),
      allowNull: false,
      unique: true,
      validate: {
        len: [3,256],
        isEmail: true
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: { len: [60,60]}
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {isAlpha: true}
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {isAlpha: true}
    },
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
      }
    }
  });
  return User;
};

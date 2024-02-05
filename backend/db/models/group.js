'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group.hasMany(models.Event, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
        hooks: true
      });

      Group.hasMany(models.Venue, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
        hooks: true
      });

      Group.hasMany(models.GroupImage, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
        hooks: true
      });

      Group.hasMany(models.Membership, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
        hooks: true
      });

      Group.belongsTo(models.User, {
        as: 'Organizer',
        foreignKey: 'organizerId'
      });
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1,60],
          msg: 'Name must be 60 characters or less'

        }
      }
    },
    about: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [50,3000],
          msg: 'About must have 50 characters or more'
        }
      }
    },
    type: {
      type: DataTypes.ENUM('Online', 'In person'),
      validate: {
        isIn: {
          args: [['Online', 'In person']],
          msg: "Type must be 'Online' or 'In person'"
        }
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate:{
        isBoolean(value){
          if (value !== true && value !== false){
            throw new Error('Private must be a boolean')
          }
        }
      }
    },
    city: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          args: [true],
          msg: "City is required"
        }
      }
    },
    state: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          args: [true],
          msg: "State is required"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};

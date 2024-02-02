'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {

    static associate(models) {
      // define association here
      Event.hasMany(models.Attendence, {
        foreignKey: 'eventId',
        onDelete: 'CASCADE',
        hooks: true
      }),

      Event.hasMany(models.EventImage, {
        foreignKey: 'eventId',
        onDelete: 'CASCADE',
        hooks: true
      }),

      Event.belongsTo(models.Group, {
        foreignKey: 'groupId'
      }),

      Event.belongsTo(models.Venue, {
        foreignKey: 'venueId'
      })
    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Venue',
        key: 'id'
      }
    },
    groupId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Group',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [5],
          msg: "Name must be at least 5 characters"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Description is required"
        }
      }
    },
    type: {
      type:DataTypes.ENUM,
      values:['Online', 'In person'],
      validate: {
        isIn: {
          args: [['Online', 'In person']],
          msg: "Type must be Online or In person"
        }
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Capacity must be an integer"
        }
      }
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      validate: {
          isDecimal: {
              args: true,
              msg: "Price must be a decimal number"
          },
          isPositive(value) {
              if (parseFloat(value) < 0) {
                  throw new Error('Price must be a positive number');
              }
          }
      }
  },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: "Start date must be in the future",
          isAfter: new Date().toString()
        }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: "End date is less than start date",
          isAfter: "startDate"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Event',
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    },
  });
  return Event;
};

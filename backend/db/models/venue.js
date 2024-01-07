'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Venue.hasMany(models.Event, {
        foreignKey: 'venueId',
        onDelete: 'CASCADE',
        hooks: true
      })
      Venue.belongsTo(models.Group, {
        foreignKey: 'groupId'
      })
    }
  }
  Venue.init({
    groupId:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Group',
        key: 'id'
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Street address is required"
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "City is required"
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "State is required"
        }
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: {
          args: [-90],
          msg: "Latitude must be within -90 and 90"
        },
        max: {
          args: [90],
          msg: "Latitude must be within -90 and 90"
        }
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: {
          args: [-180],
          msg: "Longitude must be within -180 and 180"
        },
        max: {
          args: [180],
          msg: "Longitude must be within -180 and 180"
        }
      }
    }

  }, {
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};

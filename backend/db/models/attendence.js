'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendence extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendence.belongsTo(models.User, {
        foreignKey: 'userId'
      }),

      Attendence.belongsTo(models.Event, {
        foreignKey: 'eventId'
      })
    }
  }
  Attendence.init({
    eventId: {
      type:DataTypes.INTEGER,
      references: {
        model: 'Event',
        key: 'id'
      }
    },
    userId: {
      type:DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    status: {
      type:DataTypes.ENUM,
      values: ['attending', 'waitlist', 'pending']
    },
  }, {
    sequelize,
    modelName: 'Attendence',
  });
  return Attendence;
};

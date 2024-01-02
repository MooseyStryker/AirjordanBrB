'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class events extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  events.init({
    venueId: {
      type: DataTypes.INTEGER
    },
    groupId: {
      type: DataTypes.INTEGER},
    name: {
      type: DataTypes.STRING},
    description: {
      type: DataTypes.TEXT},
    type: {
      type:DataTypes.ENUM,
      values:['Online', 'In person']
    },
    capacity: {
      type: DataTypes.INTEGER},
    price: {
      type: DataTypes.INTEGER},
    startDate: {
      type: DataTypes.DATE},
    endDate: {
      type: DataTypes.DATE}
  }, {
    sequelize,
    modelName: 'events',
  });
  return events;
};

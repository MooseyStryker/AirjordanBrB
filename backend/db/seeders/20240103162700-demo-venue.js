'use strict';

const { Venue } = require('../models');

let options = {}

/* you specified a schema name for the production environment only. When you look at your data in sqlite in the development environment, the tables will not be prefixed by the schema name */
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await Venue.bulkCreate([
        {
          groupId: 1,
          address: '123 Disney Lane',
          city: 'New York',
          state: 'NY',
          lat: 37.7645358,
          lng: -122.4730327
        },
        {
          groupId: 2,
          address: '456 Pixar Street',
          city: 'Los Angeles',
          state: 'CA',
          lat: 34.052235,
          lng: -118.243683
        },
        {
          groupId: 3,
          address: '789 Dreamworks Drive',
          city: 'Chicago',
          state: 'IL',
          lat: 41.878113,
          lng: -87.629799
        }
      ]);
    } catch (error){
      console.error('Error occured:', error)
    }
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {});
  }
};

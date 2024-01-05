'use strict';

const { Event } = require('../models');

let options = {}

/* you specified a schema name for the production environment only. When you look at your data in sqlite in the development environment, the tables will not be prefixed by the schema name */
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await Event.bulkCreate([
        {
          venueId: 1,
          groupId: 1,
          name: 'Event 1',
          description: 'This is a description for Event 1',
          type: 'Online',
          capacity: 100,
          price: 50,
          startDate: new Date(2024, 1, 1),
          endDate: new Date(2024, 1, 2)
      },
      {
          venueId: 2,
          groupId: 2,
          name: 'Event 2',
          description: 'This is a description for Event 2',
          type: 'In person',
          capacity: 200,
          price: 100,
          startDate: new Date(2024, 2, 1),
          endDate: new Date(2024, 2, 2)
      }
      ]);
    } catch (error){
      console.error('Error occured:', error)
    }
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {});

  }
};

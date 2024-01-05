'use strict';

const { Attendence } = require('../models');

let options = {}

/* you specified a schema name for the production environment only. When you look at your data in sqlite in the development environment, the tables will not be prefixed by the schema name */
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await Attendence.bulkCreate([
        {
          eventId: 1,
          userId: 1,
          status: 'attending'
        },
        {
          eventId: 1,
          userId: 2,
          status: 'waitlist'
        },
        {
          eventId: 1,
          userId: 3,
          status: 'pending'
        }
      ]);
    } catch (error){
      console.error('Error occured:', error)
    }
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Attendences';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {});

  }
};

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
        },
        {
          eventId: 2,
          userId: 4,
          status: 'attending'
        },
        {
          eventId: 2,
          userId: 5,
          status: 'waitlist'
        },
        {
          eventId: 2,
          userId: 6,
          status: 'pending'
        },
        {
          eventId: 12,
          userId: 12,
          status: 'attending'
        },
        {
          eventId: 12,
          userId: 13,
          status: 'waitlist'
        },
        {
          eventId: 1,
          userId: 4,
          status: 'pending'
        },
        {
          eventId: 1,
          userId: 5,
          status: 'attending'
        },
        {
          eventId: 12,
          userId: 1,
          status: 'waitlist'
        },
        {
          eventId: 12,
          userId: 2,
          status: 'pending'
        },
        {
          eventId: 12,
          userId: 3,
          status: 'attending'
        },
        {
          eventId: 3,
          userId: 6,
          status: 'attending'
        },
        {
          eventId: 4,
          userId: 7,
          status: 'waitlist'
        },
        {
          eventId: 5,
          userId: 8,
          status: 'pending'
        },
        {
          eventId: 6,
          userId: 9,
          status: 'attending'
        },
        {
          eventId: 7,
          userId: 10,
          status: 'waitlist'
        },
        {
          eventId: 8,
          userId: 11,
          status: 'pending'
        },
        {
          eventId: 9,
          userId: 12,
          status: 'attending'
        },
        {
          eventId: 10,
          userId: 13,
          status: 'waitlist'
        },
        {
          eventId: 11,
          userId: 6,
          status: 'pending'
        },
        {
          eventId: 1,
          userId: 7,
          status: 'attending'
        },
        {
          eventId: 2,
          userId: 8,
          status: 'waitlist'
        },
        {
          eventId: 3,
          userId: 9,
          status: 'pending'
        },
        {
          eventId: 4,
          userId: 10,
          status: 'attending'
        },
        {
          eventId: 5,
          userId: 11,
          status: 'waitlist'
        },
        {
          eventId: 6,
          userId: 12,
          status: 'pending'
        },
        {
          eventId: 7,
          userId: 13,
          status: 'attending'
        },
        {
          eventId: 8,
          userId: 6,
          status: 'waitlist'
        },
        {
          eventId: 9,
          userId: 7,
          status: 'pending'
        },
        {
          eventId: 10,
          userId: 8,
          status: 'attending'
        },
        {
          eventId: 11,
          userId: 9,
          status: 'waitlist'
        },
        {
          eventId: 12,
          userId: 10,
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

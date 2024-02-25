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
          name: 'This is an event based on Gardening! This should look good!',
          description: 'This is an event based on Gardening! This should look good! This is an event based on Gardening! This should look good! Gardening in its ornamental sense needs a certain level of civilization before it can flourish. Wherever that level has been attained, in all parts of the world and at all periods, people have made efforts to shape their environment into an attractive display. The instinct and even enthusiasm for gardening thus appear to arise from some primitive response to nature, engendering a wish to produce growth and harmony in a creative partnership with it.',
          type: 'Online',
          capacity: 100,
          price: 50,
          startDate: new Date(2024, 1, 1),
          endDate: new Date(2024, 1, 2)
      },
      {
        venueId: 1,
        groupId: 1,
        name: 'Future Gardening Event',
        description: 'This is an upcoming event about gardening. Stay tuned for more updates!',
        type: 'Online',
        capacity: 100,
        price: 50,
        startDate: new Date(2024, 3, 1),
        endDate: new Date(2024, 3, 2)
      },
      {
        venueId: 1,
        groupId: 1,
        name: 'Present Gardening Event',
        description: 'This is an ongoing event about gardening. Join us to learn and have fun!',
        type: 'Online',
        capacity: 90,
        price: 45,
        startDate: new Date(2024, 2, 23),
        endDate: new Date(2024, 2, 24)
      },
      {
        venueId: 1,
        groupId: 1,
        name: 'Past Gardening Event',
        description: 'This was a wonderful event about gardening. We learned a lot and had fun!',
        type: 'Online',
        capacity: 80,
        price: 40,
        startDate: new Date(2023, 11, 1),
        endDate: new Date(2023, 11, 2)
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
      },
      {
        venueId: 3,
        groupId: 3,
        name: 'Event 3',
        description: 'This is a description for Event 3',
        type: 'Online',
        capacity: 150,
        price: 75,
        startDate: new Date(2024, 3, 1),
        endDate: new Date(2024, 3, 2)
      },
      {
        venueId: 4,
        groupId: 4,
        name: 'Event 4',
        description: 'This is a description for Event 4',
        type: 'In person',
        capacity: 250,
        price: 125,
        startDate: new Date(2024, 4, 1),
        endDate: new Date(2024, 4, 2)
      },
      {
        venueId: 5,
        groupId: 5,
        name: 'Event 5',
        description: 'This is a description for Event 5',
        type: 'In person',
        capacity: 300,
        price: 150,
        startDate: new Date(2024, 5, 1),
        endDate: new Date(2024, 5, 2)
      },
      {
        venueId: 6,
        groupId: 6,
        name: 'Event 6',
        description: 'This is a description for Event 6',
        type: 'Online',
        capacity: 350,
        price: 175,
        startDate: new Date(2024, 6, 1),
        endDate: new Date(2024, 6, 2)
      },
      {
        venueId: 7,
        groupId: 7,
        name: 'Event 7',
        description: 'This is a description for Event 7',
        type: 'In person',
        capacity: 400,
        price: 200,
        startDate: new Date(2024, 7, 1),
        endDate: new Date(2024, 7, 2)
      },
      {
        venueId: 8,
        groupId: 8,
        name: 'Event 8',
        description: 'This is a description for Event 8',
        type: 'Online',
        capacity: 450,
        price: 225,
        startDate: new Date(2024, 8, 1),
        endDate: new Date(2024, 8, 2)
      },
      {
        venueId: 9,
        groupId: 9,
        name: 'Event 9',
        description: 'This is a description for Event 9',
        type: 'In person',
        capacity: 500,
        price: 250,
        startDate: new Date(2024, 9, 1),
        endDate: new Date(2024, 9, 2)
      },
      {
        venueId: 10,
        groupId: 10,
        name: 'Event 10',
        description: 'This is a description for Event 10',
        type: 'Online',
        capacity: 550,
        price: 275,
        startDate: new Date(2024, 10, 1),
        endDate: new Date(2024, 10, 2)
      },
      {
        venueId: 11,
        groupId: 11,
        name: 'Event 11',
        description: 'This is a description for Event 11',
        type: 'In person',
        capacity: 600,
        price: 300,
        startDate: new Date(2024, 11, 1),
        endDate: new Date(2024, 11, 2)
      },
      {
        venueId: 12,
        groupId: 12,
        name: 'Event 12',
        description: 'This is a description for Event 12',
        type: 'Online',
        capacity: 600,
        price: 300,
        startDate: new Date(2024, 12, 1),
        endDate: new Date(2024, 12, 2)
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

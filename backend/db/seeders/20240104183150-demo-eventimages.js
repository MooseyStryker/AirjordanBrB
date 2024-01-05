'use strict';

const { EventImage } = require('../models');

let options = {}

/* you specified a schema name for the production environment only. When you look at your data in sqlite in the development environment, the tables will not be prefixed by the schema name */
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await EventImage.bulkCreate([
        {
          eventId: 1,
          url: 'https://example.com/image1.jpg',
          preview: true
        },
        {
          eventId: 2,
          url: 'https://example.com/image2.jpg',
          preview: false
        },
        {
          eventId: 3,
          url: 'https://example.com/image3.jpg',
          preview: true
        },
        {
          eventId: 4,
          url: 'https://example.com/image4.jpg',
          preview: false
        },
        {
          eventId: 5,
          url: 'https://example.com/image5.jpg',
          preview: true
        },
        {
          eventId: 6,
          url: 'https://example.com/image6.jpg',
          preview: false
        },
        {
          eventId: 7,
          url: 'https://example.com/image7.jpg',
          preview: true
        },
        {
          eventId: 8,
          url: 'https://example.com/image8.jpg',
          preview: false
        },
        {
          eventId: 9,
          url: 'https://example.com/image9.jpg',
          preview: true
        },
        {
          eventId: 10,
          url: 'https://example.com/image10.jpg',
          preview: false
        },
        {
          eventId: 11,
          url: 'https://example.com/image11.jpg',
          preview: true
        },
        {
          eventId: 12,
          url: 'https://example.com/image12.jpg',
          preview: false
        }

      ]);
    } catch (error){
      console.error('Error occured:', error)
    }
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {});

  }
};

'use strict';

const { GroupImage } = require('../models');

let options = {}

/* you specified a schema name for the production environment only. When you look at your data in sqlite in the development environment, the tables will not be prefixed by the schema name */
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await GroupImage.bulkCreate([
        {
          groupId: 1,
          url: 'https://example.com/image1.jpg',
          preview: true
        },
        {
          groupId: 2,
          url: 'https://example.com/image2.jpg',
          preview: false
        },
        {
          groupId: 3,
          url: 'https://example.com/image3.jpg',
          preview: true
        }
      ]);
    } catch (error){
      console.error('Error occured:', error)
    }
  },


  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {});
  }
};

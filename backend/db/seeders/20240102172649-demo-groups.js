'use strict';

const { Group } = require('../models');

let options = {}

/* you specified a schema name for the production environment only. When you look at your data in sqlite in the development environment, the tables will not be prefixed by the schema name */
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await Group.bulkCreate([
        {
          organizerId: 1,
          name:"farms",
          about:'This is all about touching grass and seeing cows',
          type: 'In person',
          private: false,
          city: 'Tucson',
          state: 'Az',
          numMembers: 10,
          previewImage:'Thiskdjae'
        },
        {
          organizerId: 2,
          name:"zoos",
          about:'This is all about touching concrete and seeing elephants',
          type: 'In person',
          private: false,
          city: 'Tucson',
          state: 'Az',
          numMembers: 10,
          previewImage:'Thiskdjae'
        },
        {
          organizerId: 3,
          name:"skate",
          about:'This is all about touching skateboards and seeing kids fall',
          type: 'In person',
          private: true,
          city: 'Tucson',
          state: 'Az',
          numMembers: 10,
          previewImage:'Thiskdjae'
        }
      ], { validate: true });
    } catch (error) {
      console.error('Error occurred:', error);
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['farms', 'zoos', 'skate'] }
    }, {});

  }
};

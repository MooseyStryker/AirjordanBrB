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
            name: "gardening",
            about: "This is all about planting flowers and growing vegetables",
            type: "In person",
            private: false,
            city: "Tucson",
            state: "Az"
          },
          {
            organizerId: 2,
            name: "aquariums",
            about: "This is all about maintaining fish tanks and aquatic plants",
            type: "In person",
            private: false,
            city: "Tucson",
            state: "Az"
          },
          {
            organizerId: 3,
            name: "coding",
            about: "This is all about learning to code and building projects",
            type: "In person",
            private: true,
            city: "Tucson",
            state: "Az",
          },
          {
            organizerId: 1,
            name: "hiking",
            about: "This is all about exploring nature trails and mountain climbing",
            type: "In person",
            private: false,
            city: "Tucson",
            state: "Az"
          },
          {
            organizerId: 2,
            name: "photography",
            about: "This is all about taking stunning photos and editing techniques",
            type: "In person",
            private: false,
            city: "Tucson",
            state: "Az"
          },
          {
            organizerId: 3,
            name: "cooking",
            about: "This is all about trying new recipes and cooking techniques",
            type: "In person",
            private: true,
            city: "Tucson",
            state: "Az"
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

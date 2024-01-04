'use strict';

const { Membership } = require('../models');

let options = {}

/* you specified a schema name for the production environment only. When you look at your data in sqlite in the development environment, the tables will not be prefixed by the schema name */
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await Membership.bulkCreate([
        {
          groupId: 1,
          userId: 1,
          status: 'co-host'
        },
        {
          groupId: 1,
          userId: 2,
          status: 'member'
        },
        {
          groupId: 2,
          userId: 2,
          status: 'co-host'
        },
        {
          groupId: 1,
          userId: 3,
          status: 'pending'
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
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {});
  }
};

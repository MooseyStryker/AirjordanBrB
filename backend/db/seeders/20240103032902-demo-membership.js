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
          groupId: 2,
          userId: 1,
          status: 'member'
        },
        {
          groupId: 3,
          userId: 1,
          status: 'member'
        },
        {
          groupId: 2,
          userId: 2,
          status: 'pending'
        },
        {
          groupId: 1,
          userId: 3,
          status: 'pending'
        },
        {
          groupId: 3,
          userId: 1,
          status: 'member'
        },
        {
          groupId: 4,
          userId: 5,
          status: 'co-host'
        },
        {
          groupId: 5,
          userId: 6,
          status: 'pending'
        },
        {
          groupId: 6,
          userId: 7,
          status: 'member'
        },
        {
          groupId: 7,
          userId: 8,
          status: 'co-host'
        },
        {
          groupId: 8,
          userId: 9,
          status: 'pending'
        },
        {
          groupId: 9,
          userId: 10,
          status: 'member'
        },
        {
          groupId: 10,
          userId: 11,
          status: 'co-host'
        },
        {
          groupId: 11,
          userId: 12,
          status: 'pending'
        },
        {
          groupId: 12,
          userId: 13,
          status: 'member'
        },
        {
          groupId: 13,
          userId: 1,
          status: 'member'
        },
        {
          groupId: 1,
          userId: 2,
          status: 'pending'
        },
        {
          groupId: 2,
          userId: 3,
          status: 'member'
        },
        {
          groupId: 3,
          userId: 4,
          status: 'co-host'
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

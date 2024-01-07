'use strict';

const { Venue } = require('../models');

let options = {}

/* you specified a schema name for the production environment only. When you look at your data in sqlite in the development environment, the tables will not be prefixed by the schema name */
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await Venue.bulkCreate([
        {
          groupId: 1,
          address: '123 Disney Lane',
          city: 'New York',
          state: 'NY',
          lat: 37.7645358,
          lng: -122.4730327
        },
        {
          groupId: 2,
          address: '456 Pixar Street',
          city: 'Los Angeles',
          state: 'CA',
          lat: 34.052235,
          lng: -118.243683
        },
        {
          groupId: 3,
          address: '789 Dreamworks Drive',
          city: 'Chicago',
          state: 'IL',
          lat: 41.878113,
          lng: -87.629799
        },{
          groupId: 4,
          address: '101 Marvel Avenue',
          city: 'Houston',
          state: 'TX',
          lat: 29.760427,
          lng: -95.369804
        },
        {
          groupId: 5,
          address: '202 DC Boulevard',
          city: 'Phoenix',
          state: 'AZ',
          lat: 33.448377,
          lng: -112.074037
        },
        {
          groupId: 6,
          address: '303 Hanna-Barbera Parkway',
          city: 'Philadelphia',
          state: 'PA',
          lat: 39.952583,
          lng: -75.165222
        },
        {
          groupId: 7,
          address: '404 Nickelodeon Street',
          city: 'San Antonio',
          state: 'TX',
          lat: 29.424122,
          lng: -98.493629
        },
        {
          groupId: 8,
          address: '505 Cartoon Network Avenue',
          city: 'San Diego',
          state: 'CA',
          lat: 32.715736,
          lng: -117.161087
        },
        {
          groupId: 9,
          address: '606 Warner Bros Boulevard',
          city: 'Dallas',
          state: 'TX',
          lat: 32.776664,
          lng: -96.796988
        },
        {
          groupId: 10,
          address: '707 Disney Junior Drive',
          city: 'San Jose',
          state: 'CA',
          lat: 37.338208,
          lng: -121.886329
        },
        {
          groupId: 11,
          address: '808 Universal Kids Parkway',
          city: 'Austin',
          state: 'TX',
          lat: 30.267153,
          lng: -97.743057
        },
        {
          groupId: 12,
          address: '909 BabyFirst TV Way',
          city: 'Jacksonville',
          state: 'FL',
          lat: 30.332184,
          lng: -81.655651
        },
        {
          groupId: 13,
          address: '1010 Nick Jr. Lane',
          city: 'Fort Worth',
          state: 'TX',
          lat: 31.549333,
          lng: -97.146670
        },
        {
          groupId: 14,
          address: '1111 Boomerang Street',
          city: 'Columbus',
          state: 'OH',
          lat: 39.961176,
          lng: -82.998794
        },
        {
          groupId: 15,
          address: '1212 Sprout Avenue',
          city: 'San Francisco',
          state: 'CA',
          lat: 37.774929,
          lng: -122.419418
        },
        {
          groupId: 16,
          address: '1313 CBeebies Boulevard',
          city: 'Charlotte',
          state: 'NC',
          lat: 35.227085,
          lng: -80.843124
        },
        {
          groupId: 17,
          address: '1414 Tiny Pop Parkway',
          city: 'Indianapolis',
          state: 'IN',
          lat: 39.768403,
          lng: -86.158068
        },
        {
          groupId: 18,
          address: '1515 Pop Street',
          city: 'Seattle',
          state: 'WA',
          lat: 47.606209,
          lng: -122.332069
        },
        {
          groupId: 19,
          address: '1900 Studio Ghibli Way',
          city: 'Jacksonville',
          state: 'FL',
          lat: 30.332184,
          lng: -81.655651
        }

      ]);
    } catch (error){
      console.error('Error occured:', error)
    }
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {});
  }
};

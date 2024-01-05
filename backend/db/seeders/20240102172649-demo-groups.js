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
          about: "This group is dedicated to the art and science of gardening, focusing on planting flowers and growing vegetables.",
          type: "In person",
          private: false,
          city: "Tucson",
          state: "Az"
        },
        {
          organizerId: 2,
          name: "aquariums",
          about: "This group is all about the fascinating world of aquariums, maintaining fish tanks, and nurturing aquatic plants.",
          type: "In person",
          private: false,
          city: "Tucson",
          state: "Az"
        },
        {
          organizerId: 3,
          name: "coding",
          about: "This group is a hub for coding enthusiasts where we learn to code, build projects, and share our experiences.",
          type: "In person",
          private: true,
          city: "Tucson",
          state: "Az",
        },
        {
          organizerId: 1,
          name: "hiking",
          about: "This group is for nature lovers who enjoy exploring nature trails, mountain climbing, and outdoor adventures.",
          type: "In person",
          private: false,
          city: "Tucson",
          state: "Az"
        },
        {
          organizerId: 2,
          name: "photography",
          about: "This group is for photography enthusiasts where we focus on taking stunning photos and learning editing techniques.",
          type: "In person",
          private: false,
          city: "Tucson",
          state: "Az"
        },
        {
          organizerId: 3,
          name: "cooking",
          about: "This group is a haven for foodies where we try new recipes, learn cooking techniques, and share our culinary experiences.",
          type: "In person",
          private: true,
          city: "Tucson",
          state: "Az"
        },
        {
          organizerId: 4,
          name: 'Group 1',
          about: 'This group is a platform for tech enthusiasts where we discuss software development trends and share our knowledge.',
          type: 'Online',
          private: false,
          city: 'Scottsdale',
          state: 'Arizona'
        },
        {
          organizerId: 5,
          name: 'Group 2',
          about: 'This group is for those interested in machine learning. We discuss ML concepts, algorithms, and real-world applications.',
          type: 'In person',
          private: true,
          city: 'Phoenix',
          state: 'Arizona'
        },
        {
          organizerId: 6,
          name: 'Group 3',
          about: 'This group is for data science enthusiasts. We explore data science concepts, tools, and data-driven decision making.',
          type: 'Online',
          private: true,
          city: 'Mesa',
          state: 'Arizona'
        },
        {
          organizerId: 7,
          name: 'Group 4',
          about: 'This group is for web development enthusiasts. We discuss web technologies, frameworks, and best practices.',
          type: 'In person',
          private: false,
          city: 'Glendale',
          state: 'Arizona'
        },
        {
          organizerId: 8,
          name: 'Group 5',
          about: 'This group is for AI enthusiasts. We discuss artificial intelligence, its implications, and future trends.',
          type: 'Online',
          private: true,
          city: 'Gilbert',
          state: 'Arizona'
        },
        {
          organizerId: 9,
          name: 'Group 6',
          about: 'This group is for those interested in network security. We discuss security protocols, threats, and prevention measures.',
          type: 'In person',
          private: false,
          city: 'Peoria',
          state: 'Arizona'
        },
        {
          organizerId: 10,
          name: 'Group 7',
          about: 'This group is for mobile app development enthusiasts. We discuss app development platforms, tools, and market trends.',
          type: 'Online',
          private: true,
          city: 'Surprise',
          state: 'Arizona'
        },
        {
          organizerId: 11,
          name: 'Group 8',
          about: 'This group is for game development enthusiasts. We discuss game design, development tools, and industry trends.',
          type: 'In person',
          private: false,
          city: 'Yuma',
          state: 'Arizona'
        },
        {
          organizerId: 12,
          name: 'Group 9',
          about: 'This group is for hardware engineering enthusiasts. We discuss hardware components, design, and manufacturing processes.',
          type: 'Online',
          private: true,
          city: 'Avondale',
          state: 'Arizona'
        },
        {
          organizerId: 13,
          name: 'Group 10',
          about: 'This group is for those interested in software testing. We discuss testing methodologies, tools, and quality assurance practices.',
          type: 'In person',
          private: false,
          city: 'Goodyear',
          state: 'Arizona'
        },
        {
          organizerId: 4,
          name: 'Group 11',
          about: 'This group is for database management enthusiasts. We discuss database models, management systems, and data handling techniques.',
          type: 'Online',
          private: true,
          city: 'Flagstaff',
          state: 'Arizona'
        },
        {
          organizerId: 5,
          name: 'Group 12',
          about: 'This group is for those interested in cloud services. We discuss various cloud platforms, services, and deployment models.',
          type: 'In person',
          private: false,
          city: 'Tempe',
          state: 'Arizona'
        },
        {
          organizerId: 13,
          name: 'Group 14',
          about: 'This group is for cloud computing enthusiasts. We discuss cloud architectures, services, and future trends in cloud computing.',
          type: 'Online',
          private: false,
          city: 'Tempe',
          state: 'Arizona'
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
    return queryInterface.bulkDelete(options, null, {});

  }
};

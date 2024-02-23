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
          url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Sheffield_Park_Gardens%2C_Fletching%2C_Sussex_-_geograph.org.uk_-_1582535.jpg',
          preview: true
        },
        {
          groupId: 2,
          url: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Underwater_Walk_of_Sea_Life_London_Aquarium.jpg',
          preview: true
        },
        {
          groupId: 3,
          url: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Escursionismo_sulle_Alpi.jpg',
          preview: true
        },
        {
          groupId: 4,
          url: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Photography_by_Victor_Albert_Grigas_%281919-2017%29_00232_Old_Town_Art_Fair_Chicago_1968_%2823705070328%29.jpg',
          preview: true
        },
        {
          groupId: 5,
          url: 'https://th.bing.com/th/id/OSK.HERODIt05JpThF_HzF2BZz3IKIbjZYoqO3qlASRXAm15mDk?rs=1&pid=ImgDetMain',
          preview: true
        },
        {
          groupId: 6,
          url: 'https://example.com/image6.jpg',
          preview: false
        },
        {
          groupId: 7,
          url: 'https://example.com/image7.jpg',
          preview: true
        },
        {
          groupId: 8,
          url: 'https://example.com/image8.jpg',
          preview: false
        },
        {
          groupId: 9,
          url: 'https://example.com/image9.jpg',
          preview: true
        },
        {
          groupId: 10,
          url: 'https://example.com/image10.jpg',
          preview: false
        },
        {
          groupId: 11,
          url: 'https://example.com/image11.jpg',
          preview: true
        },
        {
          groupId: 12,
          url: 'https://example.com/image12.jpg',
          preview: false
        },
        {
          groupId: 13,
          url: 'https://example.com/image13.jpg',
          preview: true
        },
        {
          groupId: 14,
          url: 'https://example.com/image14.jpg',
          preview: false
        },
        {
          groupId: 15,
          url: 'https://example.com/image15.jpg',
          preview: true
        },
        {
          groupId: 16,
          url: 'https://example.com/image16.jpg',
          preview: false
        },
        {
          groupId: 17,
          url: 'https://example.com/image17.jpg',
          preview: true
        },
        {
          groupId: 18,
          url: 'https://example.com/image18.jpg',
          preview: false
        },
        {
          groupId: 19,
          url: 'https://example.com/image19.jpg',
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

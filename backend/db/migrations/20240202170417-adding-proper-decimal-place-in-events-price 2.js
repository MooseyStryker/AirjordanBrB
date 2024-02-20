'use strict';

let options = {};

/* you specified a schema name for the production environment only. When you look at your data in sqlite in the development environment, the tables will not be prefixed by the schema name */
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA // Defines your schema in options object
}

options.tableName = "Events"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn(options, 'price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn(options, 'price', {

      type: Sequelize.DECIMAL,
      allowNull: false

    });
  }
};

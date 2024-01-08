'use strict';

let options = {};

/* you specified a schema name for the production environment only. When you look at your data in sqlite in the development environment, the tables will not be prefixed by the schema name */
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA // Defines your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GroupImages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      groupId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Groups',
          key: 'id'
        }
      },
      url: {
        type: Sequelize.STRING
      },
      preview: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')

      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')

      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'GroupImages'
    await queryInterface.dropTable(options);
  }
};

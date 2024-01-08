'use strict';

let options = {};

/* you specified a schema name for the production environment only. When you look at your data in sqlite in the development environment, the tables will not be prefixed by the schema name */
if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA // Defines your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Venues', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,




      //   references: {
      //     model: 'Groups',
      //     key: 'id'
      //   }
      
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Street address is required"
          }
        }
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "City is required"
          }
        }
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "State is required"
          }
        }
      },
      lat: {
        type: Sequelize.DECIMAL,
        validate: {
          min: {
            args: [-90],
            msg: "Latitude must be within -90 and 90"
          },
          max: {
            args: [90],
            msg: "Latitude must be within -90 and 90"
          }
        }
      },
      lng: {
        type: Sequelize.DECIMAL,
        validate: {
          min: {
            args: [-180],
            msg: "Longitude must be within -180 and 180"
          },
          max: {
            args: [180],
            msg: "Longitude must be within -180 and 180"
          }
        }
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
    });
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'Venues'
    await queryInterface.dropTable(options);
  }
};

const config = require('./index');

/* Notice how the production database configuration has different keys than the development configuration? When you deploy your application to production, your database will be read from a URL path instead of a local database file. You will also be using PostgresQL in production rather than SQLite3 as a SQL database management system. Recall that SQLite3 is supposed to be used ONLY in development. PostgresQL is a production-level database management system.
*/

module.exports = {
  development: {
    storage: config.dbFile,
    dialect: "sqlite",
    seederStorage: "sequelize",
    logQueryParameters: true,
    typeValidation: true
  },
  production: {
    use_env_variable: 'postgres://app_academy_project_dtqa_user:nHbBRglMYHBvkbdH2V3hmWXuJq3e634P@dpg-cm28c621hbls73eo3ogg-a/app_academy_project_dtqa',
    dialect: 'postgres',
    seederStorage: 'sequelize',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    define: {
      schema: process.env.SCHEMA
    }
  }
};

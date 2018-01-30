const path = require('path');

const config = {
    projectRoot: path.resolve(__dirname, '..'),
    databaseName: 'work-time-logger',
    port: 3000
};

const databaseConfig = {
    dialect: 'sqlite',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    // SQLite only
    storage: path.resolve(config.projectRoot, 'database.sqlite')
};

config.databaseConfig = databaseConfig;

module.exports = config;
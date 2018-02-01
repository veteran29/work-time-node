const path = require('path');

const config = {
	projectRoot: path.resolve(__dirname, '..'),
	port: 3000,
};

config.internalDb = {
	databaseName: 'work-time-logger',
	sequelizeConfig: {
		dialect: 'sqlite',

		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},

		// SQLite only
		storage: path.resolve(config.projectRoot, 'database.sqlite'),
	},
};

config.externalDb = require('./externalDb.json');

module.exports = config;
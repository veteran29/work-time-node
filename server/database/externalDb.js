const Sequelize = require('Sequelize'),
	config = require('../config').externalDb;

const sequelize = new Sequelize(config.databaseName, config.username, config.password, config.databaseConfig);

// Register models
require('./models/index')(sequelize, sequelize.DataTypes);

module.exports = sequelize;
const Sequelize = require('Sequelize'),
	config = require('../config').internalDb;

const sequelize = new Sequelize(config.databaseName, null, null, config.sequelizeConfig);

// Register models
require('../models/index')(sequelize, sequelize.DataTypes);

// Sync models to database
sequelize.sync();

module.exports = sequelize;
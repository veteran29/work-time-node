const Sequelize = require('Sequelize'),
	config = require('./config');

const sequelize = new Sequelize(config.databaseName, null, null, config.databaseConfig);

// Register models
require('./models/index')(sequelize, sequelize.DataTypes);

sequelize.sync();

module.exports = sequelize;
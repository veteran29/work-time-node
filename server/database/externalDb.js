const Sequelize = require('Sequelize'),
	config = require('../config').externalDb;

const sequelize = new Sequelize(config.databaseName, config.username, config.password, config.sequelizeConfig);

sequelize.define('TaskDetails', {
	taskName: {
		type: Sequelize.STRING(50),
		name: 'task_name'
	},
	taskId: {
		type: Sequelize.STRING(50),
		primaryKey: true,
		name: 'task_id'
	},
}, {
	tableName: 'task_details'
});

module.exports = sequelize;
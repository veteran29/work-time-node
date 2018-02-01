const Sequelize = require('sequelize');

/**
 *
 * @param {Sequelize} db
 * @param {Sequelize.DataTypes} DataTypes
 */
module.exports = function (db, DataTypes) {
	return db.define('WorkTime', {
		id: { type: DataTypes.INTEGER, primaryKey: true },
		taskId: { type: DataTypes.TEXT, unique: 'workTime_Idx' },
		username: { type: DataTypes.TEXT, unique: 'workTime_Idx' },
		workedSeconds: { type: DataTypes.INTEGER, defaultValue: 0 },
	});
};
const Sequelize = require('sequelize');

/**
 * 
 * @param {Sequelize} db 
 * @param {Sequelize.DataTypes} DataTypes
 */
module.exports = function (db, DataTypes) {
    return db.define('User', {
		name: DataTypes.TEXT,
		username: {type: DataTypes.TEXT, primaryKey: true},
        workedSeconds: { type: DataTypes.INTEGER, defaultValue: 0 }
	});
};
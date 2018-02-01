module.exports = {

	tasks: {},

	/**
	 * @param {Object} data
	 * @param {Object} data.workTime
	 * @param {string} data.taskName
	 */
	add(data) {
		this.tasks[data.workTime.id] = data;
	},

	/**
	 *
	 * @param {number} id
	 */
	remove(id) {
		delete this.tasks[id];
	},

	/**
	 *
	 * @param {number }id
	 */
	get(id) {
		return this.tasks[id];
	}
};
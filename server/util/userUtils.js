module.exports = {
	/**
	 *
	 * @param {User} User
	 * @param {Date} lastWorkTime
	 */
	updateUserWorkTime: (User, lastWorkTime) => {
		let currentDate = new Date();
		User.workedSeconds += ( currentDate.getTime() - lastWorkTime.getTime() ) / 1000;
		return currentDate;
	}
};
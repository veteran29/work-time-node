const app = require('express')(),
	server = require('http').Server(app),
	io = require('socket.io')(server),
	config = require('./config'),
	path = require('path'),
	handlebars = require('express-handlebars'),
	sequelize = require('./database/db'),
	externalSequelize = require('./database/externalDb'),
	userUtils = require('./util/userUtils');

console.log('starting app port: ', config.port);
console.debug = console.log.bind(null, 'debug: ');
server.listen(config.port);

app.use(require('express').static(path.resolve(__dirname, '../static')));

app.engine('handlebars', handlebars({
	defaultLayout: 'main',
	layoutsDir: 'server/views/layouts',
	partials: 'server/views/partials',
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.get('/user1', function (req, res) {
	res.render('user', {
		title: 'user 1',
		name: 'USER_1',
		taskId: '503bab21309ee8612935c166c9ef47400000000020',
	});
});

app.get('/user2', function (req, res) {
	res.render('user', {
		title: 'user 2',
		name: 'USER_2',
		taskId: '503bab21309ee8612935c166c9ef47400000000031',
	});
});

app.get('/dashboard', function (req, res) {
	res.render('dashboard', {
		title: 'WT Dashboard',
		helpers: {
			'raw-helper': function (options) {
				return options.fn();
			},
		},
	});
});

const taskContainer = require('./util/taskContainer');

const userIo = require('./sockets/users')(io);
const dashboardIo = require('./sockets/dashboard')(io);

userIo.on('connection', function (socket) {
	console.debug('connection');
	let connectionWorkTime;

	socket.on('work-start', function (msg) {
		console.info('work-start', msg);

		sequelize.models.WorkTime
			.findOrCreate({
				where: {
					username: msg.username,
					taskId: msg.taskId,
				},
			}).then(workTimes => workTimes[0]).then((workTime) => {
			connectionWorkTime = workTime;
			connectionWorkTime.working = true;
			let lastWorkedTime = new Date();

			let interval = setInterval(() => {
				if (connectionWorkTime.working === false) {
					clearInterval(interval);
				}
				console.debug('work-update', connectionWorkTime.username, connectionWorkTime.workedSeconds, 'for task', connectionWorkTime.taskId);
				lastWorkedTime = userUtils.updateUserWorkTime(workTime, lastWorkedTime);

				dashboardIo.emit('work-update', { id: workTime.id, time: workTime.workedSeconds });
			}, 1500);
		}).then(() => {
			// inform dashboard about new user

			externalSequelize.models.TaskDetails.findById(connectionWorkTime.taskId)
				.then((result) => {
					return result === null ? { taskName: connectionWorkTime.taskId } : result.dataValues;
				})
				.then((data) => {
					console.debug('fetched data about task', data.taskName);
					const taskData = { workTime: connectionWorkTime, taskName: data.taskName };
					dashboardIo.emit('work-start', taskData);
					taskContainer.add(taskData);
				});
		});

		socket.on('disconnect', function () {
			if (connectionWorkTime) {
				connectionWorkTime.working = false;
				connectionWorkTime.save();

				dashboardIo.emit('work-stop', connectionWorkTime);
				taskContainer.remove(connectionWorkTime.id);
				console.log('user disconnected', connectionWorkTime);
			}
		});
	});
});

dashboardIo.on('connection', function (socket) {
	console.debug('dashboard connected');
	socket.emit('currently-working', taskContainer.tasks);

	sequelize.models.WorkTime.findAll({
		attributes: [
			'username',
			[sequelize.fn('SUM', sequelize.col('workedSeconds')), 'workedSum'],
		],
		group: ['WorkTime.username'],
	}).then((result) => {
		socket.emit('recent-tasks', result);
	});
});

console.log('start finished');
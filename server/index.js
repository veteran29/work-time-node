const app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
	config = require('./config'),
	path = require('path'),
	handlebars = require('express-handlebars'),
	sequelize = require('./db'),
	userUtils = require('./util/userUtils');

console.log('starting app');
server.listen(config.port);

app.engine('handlebars', handlebars({
	defaultLayout: 'main',
	layoutsDir: 'server/views/layouts',
	partials: 'server/views/partials'
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.get('/user1', function (req, res) {
	res.render('user', {
		name: 'USER_1'
	});
});

app.get('/user2', function (req, res) {
	res.render('user', {
		name: 'USER_2'
	});
});

const userIo = require('./sockets/users')(io);
const dashboardIo = require('./sockets/dashboard')(io);

userIo.on('connection', function (socket) {
	console.log('connection');
	let connectionUser;

	socket.on('work-start', function (msg) {
		console.log('work-start', msg);

		const userModel = sequelize.models.User
			.findOrCreate({
				where: {
					username: msg.username
				}
			}).then(userArr => userArr[0]).then((user) => {
				connectionUser = user;
				connectionUser.working = true;
				let lastWorkedTime = new Date();
				let interval = setInterval(() => {
					if(connectionUser.working === false) {
						clearInterval(interval);
					}
					console.log('updating work time of user: ', connectionUser.username, connectionUser.workedSeconds);
					lastWorkedTime = userUtils.updateUserWorkTime(user, lastWorkedTime);
				}, 3000)
			});
	});

	socket.on('disconnect', function() {
		if(connectionUser) {
			console.log('user disconnected', connectionUser);
			connectionUser.working = false;
			connectionUser.save();
		}
	});

});

console.log('start finished');
new Vue({
	el: '#app',
	data: function () {
		return {
			currentlyWorking: [],
		};
	},
	computed: {
		workingCount: function () {
			return this.currentlyWorking.length;
		},
	},
	mounted: function () {
		var vm = this;
		console.info('dashboardMounted');
		vm.$socket = io('/dashboard');

		vm.$socket.on('work-start', function (workTime) {
			console.debug('work-start', workTime, workTime.username);
			vm.addCurrentlyWorking(workTime);
		});

		vm.$socket.on('work-stop', function (workTime) {
			console.debug('work-stop', workTime, workTime.username);
			vm.removeCurrentlyWorking(workTime);
		});

		vm.$socket.on('work-update', function (workTime) {
			console.debug('work-update', workTime);
			vm.updateUserWorkTime(workTime);
		});

	},
	methods: {
		addCurrentlyWorking: function (workTime) {
			this.currentlyWorking.push(workTime);
		},
		removeCurrentlyWorking: function (workTime) {
			this.currentlyWorking = this.currentlyWorking.filter(function (x) {
				return x.id !== workTime.id;
			});
		},
		updateUserWorkTime: function (workTime) {
			var workTimes = this.currentlyWorking.filter(function (x) {
				return x.id === workTime.id;
			});
			if (workTimes.length) {
				workTimes[0].workedSeconds = workTime.time;
			}
			else {
				console.log('should fetch missing workTime', workTime.id);
			}
		},
		secondsToTime: function (time) {
			var seconds = Math.floor(time),
				hours = Math.floor(seconds / 3600);
			seconds -= hours * 3600;
			var minutes = Math.floor(seconds / 60);
			seconds -= minutes * 60;

			if (hours < 10) {hours = '0' + hours;}
			if (minutes < 10) {minutes = '0' + minutes;}
			if (seconds < 10) {seconds = '0' + seconds;}
			return hours + ':' + minutes + ':' + seconds;
		},
	},
});
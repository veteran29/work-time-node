new Vue({
	el: '#app',
	data: function () {
		return {
			currentlyWorking: {},
			recentTasks: [],
		};
	},
	computed: {
		workingCount: function () {
			return Object.getOwnPropertyNames(this.currentlyWorking).length - 1;
		},
	},
	mounted: function () {
		var vm = this;
		console.info('dashboardMounted');
		vm.$socket = io('/dashboard');

		vm.$socket.on('currently-working', function (currentData) {
			vm.currentlyWorking = currentData;

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
		});

		vm.$socket.on('recent-tasks', function (data) {
			vm.recentTasks = data;
		});
	},
	methods: {
		addCurrentlyWorking: function (data) {
			this.$set(this.currentlyWorking, data.workTime.id, data);
		},
		removeCurrentlyWorking: function (data) {
			this.$delete(this.currentlyWorking, data.id);
		},
		updateUserWorkTime: function (data) {

			if (this.currentlyWorking[data.id]) {
				this.currentlyWorking[data.id].workTime.workedSeconds = data.time;
			}
			else {
				console.log('should fetch missing workTime', data.id);
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
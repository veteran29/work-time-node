var db = require('./server/database/externalDb');

db.models.TaskDetails.findAll()
	.then((result) => console.log(result));
/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');
var rollbar = require('rollbar');

/*var cluster = require('cluster');

if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;
    console.log('There are '+cpuCount+ ' CPUs here!!!!');
    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
    // Listen for dying workers
	cluster.on('exit', function (worker) {
	    // Replace the dead worker, we're not sentimental
	    console.log('Worker ' + worker.id + ' died :(');
	    cluster.fork();
	});

// Code to run if we're in a worker process
} else {

	// Connect to database
	mongoose.connect(config.mongo.uri, config.mongo.options);

	// Populate DB with sample data
	if(config.seedDB) { require('./config/seed'); }

	// Setup server
	var app = express();
	var server = require('http').createServer(app);
	require('./config/express')(app);
	require('./routes')(app);
	require('./backgroundTasks').start();

	// Use the rollbar error handler to send exceptions to your rollbar account
	app.use(rollbar.errorHandler('fd9dcb150036419292ea7ae4bd8b4e0e'));

	// Start server
	server.listen(config.port, config.ip, function () {
	  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
	  console.log('Worker ' + cluster.worker.id + ' running!');
	});

	// Expose app
	exports = module.exports = app;
}*/
// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);
require('./backgroundTasks').start();

// Use the rollbar error handler to send exceptions to your rollbar account
app.use(rollbar.errorHandler('fd9dcb150036419292ea7ae4bd8b4e0e'));

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
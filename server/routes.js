/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors'),
    jwt = require('jwt-simple');

var Agenda = require('agenda'),
    agendaUI = require('agenda-ui'),/*
    moment = require('moment'),
    Registration = require('./api/registration/registration.model'),*/
    config = require('./config/environment');

var agenda = new Agenda({db: { address: config.mongo.uri }});

module.exports = function(app) {

  app.use('/auth', require('./api/auth'));

  app.get('/moment', function(req, res){
    var start = moment().subtract(1,'d').hours(0).minutes(0).seconds(0),
        end = moment().hours(0).minutes(0).seconds(0);

    Registration.find({"lastModified": { $gte: start, $lt: end } }, function(err, regs) {
      res.json({from: start, to: end});
    });
  });

  app.use('/__agenda-check__', agendaUI(agenda, {poll: 30000}));

  // Insert routes below
  app.use('/api/invoices', require('./api/invoice'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/registrations', require('./api/registration'));
  app.use('/api/members', require('./api/member'));
  //app.use('/api/things', spMiddleware.authenticate, require('./api/thing'));
  app.use('/api/things', require('./api/thing'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*').get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
  .get(function(req, res) {
    res.sendfile(app.get('appPath') + '/index.html');
  });

};
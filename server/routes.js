/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors'),
    jwt = require('jwt-simple');

var Agenda = require('agenda'),
    agendaUI = require('agenda-ui'),
    config = require('./config/environment');

var agenda = new Agenda({db: { address: config.mongo.uri }});

module.exports = function(app) {

  app.use('/auth', require('./api/auth'));

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

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  // All other routes should redirect to the index.html
  app.route('/*')
  .get(function(req, res) {
    res.sendfile(app.get('appPath') + '/index.html');
  });

};
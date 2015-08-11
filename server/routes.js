/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors'),
    jwt = require('jwt-simple');

var Agenda = require('agenda'),
    Bag = require('./api/bag/bag.model'),
    agendaUI = require('agenda-ui'),
    config = require('./config/environment');

var agenda = new Agenda({db: { address: config.mongo.uri }});

module.exports = function(app) {

    Bag.find({}, function(e, b) {
        if (!b.length) {
            // Create Default Bags
            Bag.create({ name: 'OPTION ONE', image: process.env.DOMAIN+'/assets/images/option-1.jpg', quantity: 2019 },{ name: 'OPTION TWO', image: process.env.DOMAIN+'/assets/images/option-2.jpg', quantity: 3874 },{ name: 'OPTION THREE', image: process.env.DOMAIN+'/assets/images/option-3.jpg', quantity: 1048 });
        }
    });

  app.use('/auth', require('./api/auth'));

  app.use('/__agenda-check__', agendaUI(agenda, {poll: 30000}));

  // Insert routes below
  app.use('/api/bags', require('./api/bag'));
  app.use('/api/speakers', require('./api/speaker'));
  app.use('/api/sessions', require('./api/session'));
  app.use('/api/invoices', require('./api/invoice'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/registrations', require('./api/registration'));
  app.use('/api/members', require('./api/member'));

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
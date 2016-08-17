/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors'),
    jwt = require('jwt-simple');

var Agenda = require('agenda'),
    Bag = require('./api/bag/bag.model'),
    // agendaUI = require('agenda-ui'),
    config = require('./config/environment');

var agenda = new Agenda({db: {address: config.mongo.uri}});

module.exports = function (app) {

    // Bag.find({}, function(e, b) {
    //     if (!b.length) {
    //         // Create Default Bags
    //         Bag.create({ name: 'OPTION ONE', image: process.env.DOMAIN+'/assets/images/option-1.jpg', quantity: 2019 },{ name: 'OPTION TWO', image: process.env.DOMAIN+'/assets/images/option-2.jpg', quantity: 3874 },{ name: 'OPTION THREE', image: process.env.DOMAIN+'/assets/images/option-3.jpg', quantity: 1048 });
    //     }
    // });

    app.use('/auth', require('./api/auth'));

    // app.use('/__agenda-check__', agendaUI(agenda, {poll: 30000}));

    // Insert routes below
    app.use('/api/bags', require('./api/bag'));
    app.use('/api/speakers', require('./api/speaker'));
    app.use('/api/sessions', require('./api/session'));
    app.use('/api/invoices', require('./api/invoice'));
    app.use('/api/users', require('./api/user'));
    app.use('/api/registrations', require('./api/registration'));
    app.use('/api/members', require('./api/member'));
    app.use('/api/livefeed', require('./api/livefeed'));

    //api routes for mobile
    app.use('/mobile/conferenceFee', require('./mobile/conferenceFee'));
    app.use('/mobile/auth', require('./mobile/auth'));
    app.use('/mobile/api/speakers', require('./mobile/speaker'));
    app.use('/mobile/api/sessions', require('./mobile/session'));
    app.use('/mobile/api/invoices', require('./mobile/invoice'));
    app.use('/mobile/api/users', require('./mobile/user'));
    app.use('/mobile/api/registrations', require('./mobile/registration'));
    app.use('/mobile/api/members', require('./mobile/member'));
    app.use('/mobile/api/tokens', require('./mobile/token'));

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|mobile|mobile|auth|components|app|bower_components|assets)/*').get(errors[404]);

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    // All other routes should redirect to the index.html
    app.route('/*')
        .get(function (req, res) {
            res.sendfile(app.get('appPath') + '/index.html');
        });

};
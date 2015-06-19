/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var cors = require('cors');
var logger = require('morgan');
var config = require('./environment');
var Agenda = require('agenda');
var _ = require('lodash');

var Registration = require('../api/registration/registration.model');

module.exports = function(app) {
  var env = app.get('env');

  app.set('views', config.root + '/server/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(cors());
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(methodOverride());
  app.use(cookieParser());
  
  if ('production' === env) {
    app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('appPath', config.root + '/public');
    app.use(morgan('dev'));

  }

  if ('development' === env || 'test' === env) {
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', 'client');
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }

  var agenda = new Agenda({db: { address: config.mongo.uri }});
  
  agenda.define('delete old registrations', function(job, done) {
    Registration.remove({formFilled: false, lastModified: { $lt: new Date(new Date().getTime() - (1000 * 3600) ) } }, done);
  });

  /*agenda.define('update Individual Web Transaction Statuses', function(job, done) {
    Registration.find({webpay: false, formFilled: true, completed: true, responseGotten:false, lastModified: { $lt: new Date(new Date().getTime() - (1000 * 3600) ) } }, function(err, pending) {
      if (err) { done(); }

      _.forEach(pending, function(record) {
        


      });
    });
  });*/

  agenda.every('10 minutes', 'delete old registrations');
  agenda.start();
};
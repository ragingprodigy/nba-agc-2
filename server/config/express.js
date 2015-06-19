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
var moment = require('moment');
var padder = require('../components/tools/pad-tool');
var mailer = require('../components/tools/mailer');

var Registration = require('../api/registration/registration.model');

function zero(w) { return padder(w, 3, '0', 1); }
function snPad(sn) { return padder(sn, 6, ' ', 3); }
function namePad(name) { return padder(name, 44, ' '); }
function emailPad(email) { return padder(email, 50, ' '); }
function phonePad(phone) { return padder(phone, 20, ' '); }

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

  agenda.define('send Web Registration Report', function(job, done) {
    var start = moment().subtract(1,'d').hours(0).minutes(0).seconds(0),
        end = moment().hours(0).minutes(0).seconds(0);
    // Get 
    Registration.find({ formFilled: true, completed: true, responseGotten:false, lastModified: { $gte: start, $lt: end } }, function(err, pending) {
      if (err) { done(); }

      var theMail = '';
      var header = '<table style="width: 100%;" border="1"><tr><th>S/N.</th><th>NAME</th><th>EMAIL ADDRESS</th><th>PHONE</th><th>FEE</th><th>CHANNEL</th></tr>';

      if (pending.length) {

        for (var i=0; i<pending.length; i++) {

          var record = pending[i];

          theMail += '<tr><td>' + snPad(zero( i+1 )) + '</td><td>' + namePad( record.prefix+'. '+record.firstName+' '+record.surname ) + '</td><td>' + emailPad( record.email ) + '</td><td>' + phonePad( record.mobile ) + '</td><td>NGN ' + record.conferenceFee  + '</td><td>' + record.webpay?'WEB':'BANK' + '</td></tr>';
        } 

        var footer = '</table>';

        if (theMail.length > 0) {
          // Send the mail here.
          mailer.sendReportEmail( header + theMail + footer, 'NBA AGC Registrations Report - Registration Report', done );
        } else {
          done();
        }
        
      } else {
        console.log('No mail to send');
        done();
      }

    });

    
  });

  /*agenda.define('send bank registration report', function(job, done) {
    Registration.find({webpay: false, formFilled: true, completed: true, responseGotten:false, lastModified: { $lt: new Date(new Date().getTime() - (1000 * 3600) ) } }, function(err, pending) {
      if (err) { done(); }

      _.forEach(pending, function(record) {
        


      });
    });
  });*/

  agenda.every('10 minutes', 'delete old registrations');
  // Run at 6:59am every Day
  agenda.every('59 6 * * *', 'send Web Registration Report');

  agenda.now('send Web Registration Report');

  agenda.start();
};
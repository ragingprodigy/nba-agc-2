'use strict';

var Agenda = require('agenda');
var _ = require('lodash');
var moment = require('moment');
var mailer = require('./components/tools/mailer');
var config = require('./config/environment');

var parseString = require('xml2js').parseString;

var Registration = require('./api/registration/registration.model');
var Invoice = require('./api/invoice/invoice.model');
var RegistrationController = require('./api/registration/registration.controller');

var agenda = new Agenda({db: { address: config.mongo.uri }});
  
agenda.define('delete old registrations', function(job, done) {
	Registration.remove({formFilled: false, lastModified: { $lt: moment().subtract(2,'h') } }, done);
});

agenda.define('Send Web Registration Report', function(job, done) {
	var start = moment().subtract(1,'d').hours(0).minutes(0).seconds(0),
	    end = moment().hours(0).minutes(0).seconds(0);
	// Get 
	Registration.find({ formFilled: true, completed: true, responseGotten:false, lastModified: { $gte: start, $lt: end } }, function(err, pending) {
	  if (err) { done(); }

	  var theMail = '';
	  var header = '<table style="width: 100%;" border="1"><tr><th>S/N.</th><th>DATE</th><th>NAME</th><th>CODE</th><th>EMAIL ADDRESS</th><th>PHONE</th><th>FEE</th><th>CHANNEL</th></tr>';

	  if (pending.length) {

	    for (var i=0; i<pending.length; i++) {

	      var record = pending[i];

	      theMail += '<tr><td>' + (i+1) + '.</td><td>' + moment(record.lastModified).format('ddd, Do MMM YYYY') + '</td><td>' + ( record.prefix+'. '+record.firstName+' '+record.surname ) + '</td><td> ' + ( record.regCode + '-' + record.conferenceFee ) + ' </td><td>' + ( record.email ) + '</td><td style="text-align:center;">' + ( record.mobile ) + '</td><td>NGN ' + record.conferenceFee  + '</td><td style="text-align:center;">' + (record.webpay?'WEB':'BANK') + '</td></tr>';
	    } 

	    var footer = '</table>';

	    if (theMail.length > 0) {
	      // Send the mail here.
	      mailer.sendReportEmail( header + theMail + footer, 'NBA AGC Registrations Report :: '+ moment().subtract(1,'d').format('dddd, MMMM Do YYYY'), done );
	    } else {
	      done();
	    }
	    
	  } else {
	    done();
	  }

	});

});

agenda.define('Send Unsuccessful Web Registration Payments Report', function(job, done) {
	var start = moment().subtract(1,'d').hours(0).minutes(0).seconds(0),
	    end = moment().hours(0).minutes(0).seconds(0);
	// Get 
	Registration.find({ formFilled: true, paymentSuccessful: false, completed: true, webpay: true, responseGotten:true, lastModified: { $gte: start, $lt: end } }, function(err, pending) {
	  if (err) { done(); }

	  var theMail = '';
	  var header = '<table style="width: 100%;" border="1"><tr><th>S/N.</th><th>DATE</th><th>NAME</th><th>CODE</th><th>EMAIL ADDRESS</th><th>PHONE</th><th>FEE</th><th>SWITCH</th><th>TRANS. REF.</th><th>STATUS</th><th>DESCRIPTION</th></tr>';

	  if (pending.length) {

	    for (var i=0; i<pending.length; i++) {

	      var record = pending[i];

	      theMail += '<tr><td>' + (i+1) + '.</td><td>' + moment(record.lastModified).format('ddd, Do MMM YYYY') + '</td><td>' + ( record.prefix+'. '+record.firstName+' '+record.surname ) + '</td><td> ' + ( record.regCode + '-' + record.conferenceFee ) + ' </td><td>' + ( record.email ) + '</td><td style="text-align:center;">' + ( record.mobile ) + '</td><td>NGN ' + record.conferenceFee  + '</td><td>' + record.PaymentGateway  + '</td><td>' + record.TransactionRef  + '</td><td style="text-align:center;">' + record.Status  + '</td><td style="text-align:center;">' + record.ResponseDescription + '</td></tr>';
	    } 

	    var footer = '</table>';

	    if (theMail.length > 0) {
	      // Send the mail here.
	      mailer.sendReportEmail( header + theMail + footer, 'NBA AGC Report :: Failed Card Payments For '+ moment().subtract(1,'d').format('dddd, MMMM Do YYYY'), done );
	    } else {
	      done();
	    }
	    
	  } else {
	    done();
	  }

	});

});

agenda.define('Send Confirmed Web Registration Report', function(job, done) {
	var start = moment().subtract(1,'d').hours(0).minutes(0).seconds(0),
	    end = moment().hours(0).minutes(0).seconds(0);
	// Get 
	Registration.find({ formFilled: true, paymentSuccessful: true, completed: true, responseGotten:true, lastModified: { $gte: start, $lt: end } }, function(err, pending) {
	  if (err) { done(); }

	  var theMail = '';
	  var header = '<table style="width: 100%;" border="1"><tr><th>S/N.</th><th>DATE</th><th>NAME</th><th>CODE</th><th>EMAIL ADDRESS</th><th>PHONE</th><th>FEE</th><th>PAID</th><th>CHANNEL</th><th>TRANS. REF.</th><th>PMT. REF.</th></tr>';

	  if (pending.length) {

	    for (var i=0; i<pending.length; i++) {

	      var record = pending[i];

	      theMail += '<tr><td>' + (i+1) + '.</td><td>' + moment(record.lastModified).format('ddd, Do MMM YYYY') + '</td><td>' + ( record.prefix+'. '+record.firstName+' '+record.surname ) + '</td><td> ' + ( record.regCode + '-' + record.conferenceFee ) + ' </td><td>' + ( record.email ) + '</td><td style="text-align:center;">' + ( record.mobile ) + '</td><td>NGN ' + record.conferenceFee  + '</td><td>NGN ' + record.Amount  + '</td><td style="text-align:center;">' + (record.webpay?'WEB':'BANK') + '</td><td>' + record.TransactionRef + '</td><td>' + record.PaymentRef + '</td></tr>';
	    } 

	    var footer = '</table>';

	    if (theMail.length > 0) {
	      // Send the mail here.
	      mailer.sendReportEmail( header + theMail + footer, 'NBA AGC Report :: Confirmed Payments For '+ moment().subtract(1,'d').format('dddd, MMMM Do YYYY'), done );
	    } else {
	      done();
	    }
	    
	  } else {
	    done();
	  }

	});

});

agenda.define('Update Web Transactions For Individuals', function(job, done) {
	var cutoff = moment().subtract(2,'h');
	Registration.find({completed: true, webpay: true, lastModified: { $lt: cutoff }}, function(err, toResolve){

		if (err) { job.fail(err); job.save(); done(); }

		if (toResolve.length) {
			_(toResolve).forEach(function(registration) {
				
				RegistrationController.querySwitch((registration.regCode+'-'+registration.conferenceFee), registration.conferenceFee, function(error, response, body) {

					if (!error && response.statusCode === 200) {

						parseString(body, function (err, result) {

							if (err) { return; }
							 
							// result is the JSON OBJECT
							result = result.CIPG;

							if (!result.Error) {
								
								// Do Update
								result.DateTime = result.Date;
								registration.responseGotten = true;
								var updated = _.merge(registration, result);
							    updated.save();

							}
						});

					}
				});
			});

			done();
		} else {
			done();
		}
	});
});

agenda.define('Update Web Transactions For Groups', function(job, done) {
	var cutoff = moment().subtract(2,'h');
	Invoice.find({finalized: true, webpay: true, lastModified: { $lt: cutoff }}, function(err, toResolve){

		if (err) { job.fail(err); job.save(); done(); }

		if (toResolve.length) {
			_(toResolve).forEach(function(invoice) {
				
				RegistrationController.querySwitch((invoice.code+'-'+invoice.invoiceAmount), invoice.invoiceAmount, function(error, response, body) {

					if (!error && response.statusCode === 200) {

						parseString(body, function (err, result) {

							if (err) { return; }
							 
							// result is the JSON OBJECT
							result = result.CIPG;

							if (!result.Error) {
								
								// Do Update
								result.DateTime = result.Date;
								invoice.responseGotten = true;
								var updated = _.merge(invoice, result);
							    updated.save();

							}
						});

					}
				});
			});

			done();
		} else {
			done();
		}
	});
});

agenda.define('Send Direct Registration Success SMS for Individuals', function(job, done) {
	Registration.find({isDirect: true, successTextSent: false, responseGotten: true, paymentSuccessful: true, statusConfirmed: true }, function(err, toResolve){

		if (err) { job.fail(err); job.save(); done(); }

		if (toResolve.length) {
			_(toResolve).forEach(function(registration) {

				mailer.sendBankRegistrationSuccessText(registration);

			});

			done();
		} else {
			done();
		}
	});
});

agenda.define('Send Direct Registration Success Email for Individuals', function(job, done) {
	Registration.find({isDirect: true, successMailSent: false, responseGotten: true, paymentSuccessful: true, statusConfirmed: true }, function(err, toResolve){

		if (err) { job.fail(err); job.save(); done(); }

		if (toResolve.length) {
			_(toResolve).forEach(function(registration) {

				mailer.sendBankRegistrationSuccessMail(registration);

			});

			done();
		} else {
			done();
		}
	});
});

// Run at 6:59am every Day
agenda.every('59 6 * * *', 'Send Web Registration Report');
agenda.every('04 7 * * *', ['Send Confirmed Web Registration Report', 'Send Unsuccessful Web Registration Payments Report']);

agenda.every('10 minutes', ['Update Web Transactions For Individuals', 'Update Web Transactions For Groups', 'Send Direct Registration Success SMS for Individuals', 'Send Direct Registration Success Email for Individuals', 'delete old registrations']);

exports.start = function() { agenda.start(); } 

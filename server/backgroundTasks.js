'use strict';

var CronJob = require('cron').CronJob;
//var cronFunction = require('../server/components/tools/cron');
var _ = require('lodash');
var mongoose = require('mongoose');
var moment = require('moment');
var mailer = require('./components/tools/mailer');
var config = require('./config/environment');
mongoose.connect(config.mongo.uri, config.mongo.options);
var async = require('async');

var parseString = require('xml2js').parseString;

var Registration = require('./api/registration/registration.model');
var Branch = require('./api/registration/branches.model');
var Invoice = require('./api/invoice/invoice.model');
var OtherRegCode = require('./api/registration/othersRegCode.model');
var User = require('./api/user/user.model');
var RegistrationController = require('./api/registration/registration.controller');

//create cron job to delete old registration data every 13 minutes
new CronJob('*/13 * * * *', function () {
	Registration.remove({formFilled: false, lastModified: { $lt: moment().subtract(2,'h') } });
	}, null, true, 'Africa/Lagos'
);

//Cron Job to Delete incomplete invoice every 12 minutes
new CronJob('*/12 * * * *', function () {
	Invoice.remove({finalized: false, bankpay: false, webpay: false, lastModified: { $lt: moment().subtract(2,'h') } });;
	}, null, true, 'Africa/Lagos'
);

//cron job to send web registration report everyday at 6:59am
new CronJob('00 59 6 * * 0-6', function () {
	var start = moment().subtract(1,'d').hours(0).minutes(0).seconds(0),
		end = moment().hours(0).minutes(0).seconds(0);
	Registration.find({ formFilled: true, completed: true, responseGotten:false, lastModified: { $gte: start, $lt: end } }, function(err, pending) {
		if (err) { return; }

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
				mailer.sendReportEmail( header + theMail + footer, 'NBA AGC Registrations Report :: '+ moment().subtract(1,'d').format('dddd, MMMM Do YYYY'));
			} else {
				return;
			}

		} 

	});
	}, null, true, 'Africa/Lagos'
);

//cron job to send unsuccessful web registration Payment Report everyday at 7:07am
new CronJob('00 07 7 * * 0-6', function(){
	var start = moment().subtract(1,'d').hours(0).minutes(0).seconds(0),
		end = moment().hours(0).minutes(0).seconds(0);
	// Get
	Registration.find({ formFilled: true, paymentSuccessful: false, completed: true, webpay: true, responseGotten:true, lastModified: { $gte: start, $lt: end } }, function(err, pending) {
		if (err) { return; }

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
				mailer.sendReportEmail( header + theMail + footer, 'NBA AGC Report :: Failed Card Payments For '+ moment().subtract(1,'d').format('dddd, MMMM Do YYYY'));
			} else {
				return;
			}

		} 

	});
}, null, true, 'Africa/Lagos');

//cron job to send confirmed web registration everyday at 7:04am
new CronJob('00 04 7 * * 0-6', function () {
	var start = moment().subtract(1,'d').hours(0).minutes(0).seconds(0),
		end = moment().hours(0).minutes(0).seconds(0);
	// Get
	Registration.find({ formFilled: true, paymentSuccessful: true, completed: true, responseGotten:true, lastModified: { $gte: start, $lt: end } }, function(err, pending) {
		if (err) { return; }

		var theMail = '';
		var header = '<table style="width: 100%;" border="1"><tr><th>S/N.</th><th>DATE</th><th>NAME</th><th>CODE</th><th>EMAIL ADDRESS</th><th>PHONE</th><th>FEE</th><th>PAID</th><th>CHANNEL</th><th>TRANS. REF.</th><th>PMT. REF.</th></tr>';

		if (pending.length) {

			for (var i=0; i<pending.length; i++) {

				var record = pending[i];

				theMail += '<tr><td>' + (i+1) + '.</td><td>' + moment(record.lastModified).format('ddd, Do MMM YYYY') + '</td><td>' + ( record.prefix+'. '+record.firstName+' '+record.surname ) + '</td><td> ' + ( record.regCode + '-' + record.conferenceFee ) + ' </td><td>' + ( record.email ) + '</td><td style="text-align:center;">' + ( record.mobile ) + '</td><td>NGN ' + record.conferenceFee  + '</td><td>NGN ' + (record.webpay?record.Amount:record.bankDeposit)  + '</td><td style="text-align:center;">' + (record.webpay?'WEB':'BANK') + '</td><td>' + record.TransactionRef + '</td><td>' + record.PaymentRef + '</td></tr>';
			}

			var footer = '</table>';

			if (theMail.length > 0) {
				// Send the mail here.
				mailer.sendReportEmail( header + theMail + footer, 'NBA AGC Report :: Confirmed Payments For '+ moment().subtract(1,'d').format('dddd, MMMM Do YYYY'));
			} else {
				return;
			}

		} 

	});
	}, null, true, 'Africa/Lagos'
);

// cron job to update web transactions for individuals 11 minutes
new CronJob('*/11 * * * *', function () {
	var cutoff = moment().subtract(2,'h');
	Registration.find({completed: true, webpay: true, lastModified: { $lt: cutoff }}, function(err, toResolve){

		if (err) { return; }

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

			return;
		} else {
			return;
		}
	});
	}, null, true, 'Africa/Lagos'
);

//cron job to update web transactions for groups every 15 minutes
new CronJob('*/15 * * * *', function () {
	var cutoff = moment().subtract(2,'h');
	Invoice.find({finalized: true, webpay: true, lastModified: { $lt: cutoff }}, function(err, toResolve){

		if (err) { return; }

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

			return;
		} else {
			return;
		}
	});
	}, null, true, 'Africa/Lagos'
);

//CronJob to send Direct Registration Success SMS for individuals every 14 minutes
new CronJob('*/14 * * * *', function () {
	Registration.find({registrationCode: { "$exists": true },isDirect: true, successTextSent: false, responseGotten: true, paymentSuccessful: true, statusConfirmed: true }, function(err, toResolve){

		if (err) { return; }

		if (toResolve.length) {
			_(toResolve).forEach(function(registration) {

				mailer.sendBankRegistrationSuccessText(registration);

			});

			return;
		} else {
			return;
		}
	});
	}, null, true, 'Africa/Lagos'
);

// Cronjob to send direct registration success email for individuals every 16 minutes
new CronJob('*/16 * * * *', function () {
	Registration.find({registrationCode: { "$exists": true },isDirect: true, successMailSent: false, responseGotten: true, paymentSuccessful: true, statusConfirmed: true }, function(err, toResolve){

		if (err) { return; }

		if (toResolve.length) {
			_(toResolve).forEach(function(registration) {

				mailer.sendBankRegistrationSuccessMail(registration);

			});

			return;
		} else {
			return;
		}
	});
	}, null, true, 'Africa/Lagos'
);

//cron job to Send Web Payment Success Email for Individuals every 13 minutes
new CronJob('*/13 * * * *', function () {
	Registration.find({registrationCode: { "$exists": true }, webpay: true, successMailSent: false, responseGotten: true, paymentSuccessful: true, statusConfirmed: true }, function(err, toResolve){

		if (err) { return;}

		if (toResolve.length) {
			_(toResolve).forEach(function(registration) {

				mailer.sendWebPaySuccessMail(registration);

			});

			return;
		} else {
			return;
		}
	});
	}, null, true, 'Africa/Lagos'
);

// Cron job to send web payment success SMS for individual every 15 minutes
new CronJob('*/15 * * * *', function () {
	Registration.find({registrationCode: { "$exists": true },webpay: true, successTextSent: false, responseGotten: true, paymentSuccessful: true, statusConfirmed: true }, function(err, toResolve){

		if (err) { return; }

		if (toResolve.length) {
			_(toResolve).forEach(function(registration) {

				mailer.sendWebPaySuccessText(registration);

			});

			return;
		} else {
			return;
		}
	});
	}, null, true, 'Africa/Lagos'
);

// cron job Send Bank Payment Success Email for Individuals every 19 minutes
new CronJob('*/19 * * * *', function () {
	Registration.find({ registrationCode: { "$exists": true },isDirect: false, bankpay: true, successMailSent: false, responseGotten: true, paymentSuccessful: true, statusConfirmed: true }, function(err, toResolve){

		if (err) { return; }

		if (toResolve.length) {
			_(toResolve).forEach(function(registration) {

				mailer.sendBankPaySuccessMail(registration);

			});
		} 
	});
	}, null, true, 'Africa/Lagos'
);

//Cron job Send Bank Payment Success SMS for Individuals every 19minutes
new CronJob('*/19 * * * *', function () {
	Registration.find({ registrationCode: { "$exists": true },isDirect: false, bankpay: true, successTextSent: false, responseGotten: true, paymentSuccessful: true, statusConfirmed: true }, function(err, toResolve) {

		if (err) { return; }

		if (toResolve.length) {
			_(toResolve).forEach(function(registration) {

				mailer.sendWebPaySuccessText(registration);

			});

			return;
		} else {
			return;
		}
	});
	}, null, true, 'Africa/Lagos'
);
//cron job Send Bank Payment Success Email for Groups every 5.04 hours
new CronJob('*/303 * * * *', function () {
	Invoice.find({ bankpay: true, successMailSent: false, responseGotten: true, paymentSuccessful: true, statusConfirmed: true })
		.populate('_group')
		.populate('registrations', '_id firstName middleName surname suffix prefix regCode conferenceFee')
		.exec(function(err, toResolve){

			if (err) { return; }

			if (toResolve.length) {
				_(toResolve).forEach(function(invoice) {

					mailer.sendGroupBankPaySuccessMail(invoice);

				});

				return;
			} else {
				return;
			}
		});
	}, null, true, 'Africa/Lagos'
);

//cron job Send Bank Payment Success SMS for Groups every 5.02 hours
new CronJob('*/301 * * * *', function () {
	Invoice.find({ bankpay: true, successTextSent: false, responseGotten: true, paymentSuccessful: true, statusConfirmed: true })
		.populate('_group')
		.exec(function(err, toResolve){

			if (err) { return; }

			if (toResolve.length) {
				_(toResolve).forEach(function(invoice) {

					mailer.sendGroupBankPaySuccessText(invoice);

				});

				return;
			} else {
				return;
			}
		});
	}, null, true, 'Africa/Lagos'
);
//cron job Send Web Payment Success Email for Groups every 5.08 hours
new CronJob('*/305 * * * *', function () {
	Invoice.find({ webpay: true, successMailSent: false, responseGotten: true, paymentSuccessful: true, statusConfirmed: true })
		.populate('_group')
		.populate('registrations', '_id firstName middleName surname suffix prefix regCode conferenceFee')
		.exec(function(err, toResolve){

			if (err) { return; }

			if (toResolve.length) {
				_(toResolve).forEach(function(invoice) {

					mailer.sendGroupWebPaySuccessMail(invoice);

				});

				return;
			} else {
				return;
			}
		});
	}, null, true, 'Africa/Lagos'
);

// cron job to Send Web Payment Success SMS for Groups very 5.06 hours
new CronJob('*/304 * * * *', function () {
	Invoice.find({ webpay: true, successTextSent: false, responseGotten: true, paymentSuccessful: true, statusConfirmed: true })
		.populate('_group')
		.exec(function(err, toResolve){

			if (err) { return; }

			if (toResolve.length) {
				_(toResolve).forEach(function(invoice) {

					mailer.sendGroupWebPaySuccessText(invoice);

				});

				return;
			} else {
				return;
			}
		});
	}, null, true, 'Africa/Lagos'
);

// cron job to Create Accounts for Paid Invoices 2.65 hours
new CronJob('*/159 * * * *', function () {
	Invoice.find({ statusConfirmed: true, paymentSuccessful: true, responseGotten: true, accountsCreated: false })
		.populate('registrations')
		.exec(function (err, toResolve){

			if (err) { return; }

			if (toResolve.length) {
				_(toResolve).forEach(function (invoice) {

					// Iterate through the registrations in this Invoice and Create Accounts for Each
					_(invoice.registrations).forEach(function (registration){

						// Create User Account Using First Name and Last Name as Username
						var username = (registration.firstName + registration.surname).split(' ').join('').toLowerCase();

						// Find Existing User
						User.find({email: username}, function (err, existingUsers) {

							if (existingUsers.length) {
								username += '_'+existingUsers.length;
							}

							var newPass = User.randomString(4).toLowerCase();

							var user = new User();
							user.email = username;
							user.password = user.generateHash(newPass);

							user.save(function() {

								Invoice.update({ _id: invoice._id }, { $set: { accountsCreated: true } }, function(){ });

								Registration.findById(registration._id, function ( err, theReg ){
									if (theReg) {

										theReg.user = user;
										theReg.statusConfirmed = true;
										theReg.responseGotten = true;
										theReg.paymentSuccessful = true;
										theReg.webpay = invoice.webpay;
										theReg.bankpay = invoice.bankpay;

										theReg.PaymentRef = invoice.PaymentRef;
										theReg.TransactionRef = invoice.TransactionRef;
										theReg.ResponseDescription = invoice.ResponseDescription;
										theReg.ResponseCode = invoice.ResponseCode;
										theReg.PaymentGateway = invoice.PaymentGateway;
										theReg.Status = invoice.Status;

										theReg.bankDatePaid = invoice.bankDatePaid;
										theReg.bankTeller = invoice.bankTeller;
										theReg.bankBranch = invoice.bankBranch;
										theReg.save(function ( err ) {

											if (err) { return err; }

											// Send Email to the User Here
											mailer.sendWelcomeMailWithUsername(theReg, newPass, username, function (err){
												if (err !== null) {return err; }

												// Send the text message
												mailer.sendRegistrationTextWithUsername(theReg, newPass, username, function (err){

													if (err!==null) { return err; }
												});

											});

										});
									}
								});

							});
						});

					});

				});

				return;
			} else {
				return;
			}
		});
	}, null, true, 'Africa/Lagos'
);


// CronJob Create Accounts for Direct Bank Registrations 2.70 hours
new CronJob('*/169 * * * *', function () {
	Registration.find({bankpay: true, statusConfirmed: true, paymentSuccessful: true, responseGotten: true, isDirect: true, accountCreated: false }, function (err, toResolve){

		if (err) { return; }

		if (toResolve.length) {

			// Iterate through the registrations and Create Accounts for Each
			_(toResolve).forEach(function (registration) {

				// Create User Account Using First Name and Last Name as Username
				var username = (registration.firstName + registration.surname).split(' ').join('').toLowerCase();

				// Find Existing User
				User.find({email: username}, function (err, existingUsers) {

					if (existingUsers.length) {
						username += '_'+existingUsers.length;
					}

					var newPass = User.randomString(4).toLowerCase();

					var user = new User();
					user.email = username;
					user.password = user.generateHash(newPass);

					user.save(function() {

						Registration.findById(registration._id, function ( err, theReg ){
							if (theReg) {

								theReg.user = user;
								theReg.accountCreated = true;

								theReg.save(function ( err ) {

									if (err) { return; }

									// Send Email to the User Here
									mailer.sendWelcomeMailWithUsername(theReg, newPass, username, function (err){
										if (err !== null) { return; }

										// Send the text message
										mailer.sendRegistrationTextWithUsername(theReg, newPass, username, function (err){

											if (err!==null) {return; }


										});

									});

								});
							}
						});

					});
				});

			});

			return;
		} else {
			return;
		}
	});
	}, null, true, 'Africa/Lagos'
);

//Cron Job to create Registration code every 2 minutes
new CronJob('*/1 * * * *', function () {
	console.log('about to start giving out codes');
	Registration.find({ registrationCode: { "$exists": false },paymentSuccessful:true }, function (err,members) {
		console.log('log me '+members.length);
		if (members.length)
		{
			async.forEachSeries(members, function (member,callback) {
				if(member.registrationType =='legalPractitioner')
				{
					async.series([
						function (callback) {
							Branch.findOne({name: member.branch}, function (err, branch) {
								if(err){
									return callback(err);}
								member.registrationCode = branch.code + '-' + branch.order;
								console.log('member code generated ' + member.registrationCode);
								var num = Number(branch.order) + 1;
								num = ("000" + num).slice(-4);
								branch.order = ''+num;
								branch.save();
								callback();
							});
						},
						function (callback) {
							Registration.update({ _id: member._id }, { $set: { registrationCode: member.registrationCode } }, function(e){
								if (e) {

									console.log(e); }
								callback();
							});
						}

					],function (err) {
						if (err)
						{
							return next(err);
						}
						console.log('registrationCode generated'+ member.registrationCode);
						callback();
					});

				}
				else {
					var code = '';
					switch (member.registrationType){
						case 'law_students':
							code = 'NLS';
							break;
						case 'international':
							code = 'INT';
							break;
						case 'judge':
							code = 'VIP';
							break;
						case 'magistrate':
							code = 'VIP';
							break;
						case 'non_lawyer':
							code = 'EXT';
							break;
						case 'sanAndBench':
							code = 'VIP';
							break;
						case 'others':
							code = 'VIP';
							break;
					}
					if(code!='')
					{
						async.series([
							function(callback){
								OtherRegCode.findOne({code:code},function(err, code){

									if(code){
										var vipcode = code.code;
										var order = code.order;
										member.registrationCode = vipcode+'-'+order;
										var num = Number(order) + 1;
										num = ("000" + num).slice(-4);
										code.order = ''+num;
										code.save();
										callback();
									}
								});
							},
							function (callback) {
								Registration.update({ _id: member._id }, { $set: { registrationCode: member.registrationCode } }, function(e){
									if (e) { console.log(e); }
									callback();
								});
							}
						],function (err) {
							if (err){ return next(err);}
							console.log('registrationCode generated'+ member.registrationCode);
							callback();
						});

					}
				}
			},function(err){
				if (err) return next(err);
				console.log(members.length + ' registrationCode was generated.');
			});
		}
	});
}, null,true,'Africa/Lagos');


// 'use strict';
//
// var Agenda = require('agenda');
// var CronJob = require('cron').CronJob;
// var _ = require('lodash');
// var moment = require('moment');
// var mailer = require('./components/tools/mailer');
// var config = require('./config/environment');
// var async = require('async');
//
// var parseString = require('xml2js').parseString;
//
// var Registration = require('./api/registration/registration.model');
// var Branch = require('./api/registration/branches.model');
// var Invoice = require('./api/invoice/invoice.model');
// var OtherRegCode = require('./api/registration/othersRegCode.model');
// var User = require('./api/user/user.model');
// var RegistrationController = require('./api/registration/registration.controller');
//
// var agenda = new Agenda({db: { address: config.mongo.uri }});
//
//
//
// agenda.define('delete old registrations', function(job, done) {
// 	Registration.remove({formFilled: false, lastModified: { $lt: moment().subtract(2,'h') } }, done);
// });
//
// agenda.define('Delete Incomplete Invoices', function(job, done) {
// 	Invoice.remove({finalized: false, bankpay: false, webpay: false, lastModified: { $lt: moment().subtract(2,'h') } }, done);
// });
//
// agenda.define('Send Web Registration Report', function(job, done) {
// 	var start = moment().subtract(1,'d').hours(0).minutes(0).seconds(0),
// 	    end = moment().hours(0).minutes(0).seconds(0);
// 	// Get
// 	Registration.find({ formFilled: true, completed: true, responseGotten:false, lastModified: { $gte: start, $lt: end } }, function(err, pending) {
// 	  if (err) { done(); }
//
// 	  var theMail = '';
// 	  var header = '<table style="width: 100%;" border="1"><tr><th>S/N.</th><th>DATE</th><th>NAME</th><th>CODE</th><th>EMAIL ADDRESS</th><th>PHONE</th><th>FEE</th><th>CHANNEL</th></tr>';
//
// 	  if (pending.length) {
//
// 	    for (var i=0; i<pending.length; i++) {
//
// 	      var record = pending[i];
//
// 	      theMail += '<tr><td>' + (i+1) + '.</td><td>' + moment(record.lastModified).format('ddd, Do MMM YYYY') + '</td><td>' + ( record.prefix+'. '+record.firstName+' '+record.surname ) + '</td><td> ' + ( record.regCode + '-' + record.conferenceFee ) + ' </td><td>' + ( record.email ) + '</td><td style="text-align:center;">' + ( record.mobile ) + '</td><td>NGN ' + record.conferenceFee  + '</td><td style="text-align:center;">' + (record.webpay?'WEB':'BANK') + '</td></tr>';
// 	    }
//
// 	    var footer = '</table>';
//
// 	    if (theMail.length > 0) {
// 	      // Send the mail here.
// 	      mailer.sendReportEmail( header + theMail + footer, 'NBA AGC Registrations Report :: '+ moment().subtract(1,'d').format('dddd, MMMM Do YYYY'), done );
// 	    } else {
// 	      done();
// 	    }
//
// 	  } else {
// 	    done();
// 	  }
//
// 	});
//
// });
//
// agenda.define('Send Unsuccessful Web Registration Payments Report', function(job, done) {
// 	var start = moment().subtract(1,'d').hours(0).minutes(0).seconds(0),
// 	    end = moment().hours(0).minutes(0).seconds(0);
// 	// Get
// 	Registration.find({ formFilled: true, paymentSuccessful: false, completed: true, webpay: true, responseGotten:true, lastModified: { $gte: start, $lt: end } }, function(err, pending) {
// 	  if (err) { done(); }
//
// 	  var theMail = '';
// 	  var header = '<table style="width: 100%;" border="1"><tr><th>S/N.</th><th>DATE</th><th>NAME</th><th>CODE</th><th>EMAIL ADDRESS</th><th>PHONE</th><th>FEE</th><th>SWITCH</th><th>TRANS. REF.</th><th>STATUS</th><th>DESCRIPTION</th></tr>';
//
// 	  if (pending.length) {
//
// 	    for (var i=0; i<pending.length; i++) {
//
// 	      var record = pending[i];
//
// 	      theMail += '<tr><td>' + (i+1) + '.</td><td>' + moment(record.lastModified).format('ddd, Do MMM YYYY') + '</td><td>' + ( record.prefix+'. '+record.firstName+' '+record.surname ) + '</td><td> ' + ( record.regCode + '-' + record.conferenceFee ) + ' </td><td>' + ( record.email ) + '</td><td style="text-align:center;">' + ( record.mobile ) + '</td><td>NGN ' + record.conferenceFee  + '</td><td>' + record.PaymentGateway  + '</td><td>' + record.TransactionRef  + '</td><td style="text-align:center;">' + record.Status  + '</td><td style="text-align:center;">' + record.ResponseDescription + '</td></tr>';
// 	    }
//
// 	    var footer = '</table>';
//
// 	    if (theMail.length > 0) {
// 	      // Send the mail here.
// 	      mailer.sendReportEmail( header + theMail + footer, 'NBA AGC Report :: Failed Card Payments For '+ moment().subtract(1,'d').format('dddd, MMMM Do YYYY'), done );
// 	    } else {
// 	      done();
// 	    }
//
// 	  } else {
// 	    done();
// 	  }
//
// 	});
//
// });
//
// agenda.define('Send Confirmed Web Registration Report', function(job, done) {
// 	var start = moment().subtract(1,'d').hours(0).minutes(0).seconds(0),
// 	    end = moment().hours(0).minutes(0).seconds(0);
// 	// Get
// 	Registration.find({ formFilled: true, paymentSuccessful: true, completed: true, responseGotten:true, lastModified: { $gte: start, $lt: end } }, function(err, pending) {
// 	  if (err) { done(); }
//
// 	  var theMail = '';
// 	  var header = '<table style="width: 100%;" border="1"><tr><th>S/N.</th><th>DATE</th><th>NAME</th><th>CODE</th><th>EMAIL ADDRESS</th><th>PHONE</th><th>FEE</th><th>PAID</th><th>CHANNEL</th><th>TRANS. REF.</th><th>PMT. REF.</th></tr>';
//
// 	  if (pending.length) {
//
// 	    for (var i=0; i<pending.length; i++) {
//
// 	      var record = pending[i];
//
// 	      theMail += '<tr><td>' + (i+1) + '.</td><td>' + moment(record.lastModified).format('ddd, Do MMM YYYY') + '</td><td>' + ( record.prefix+'. '+record.firstName+' '+record.surname ) + '</td><td> ' + ( record.regCode + '-' + record.conferenceFee ) + ' </td><td>' + ( record.email ) + '</td><td style="text-align:center;">' + ( record.mobile ) + '</td><td>NGN ' + record.conferenceFee  + '</td><td>NGN ' + (record.webpay?record.Amount:record.bankDeposit)  + '</td><td style="text-align:center;">' + (record.webpay?'WEB':'BANK') + '</td><td>' + record.TransactionRef + '</td><td>' + record.PaymentRef + '</td></tr>';
// 	    }
//
// 	    var footer = '</table>';
//
// 	    if (theMail.length > 0) {
// 	      // Send the mail here.
// 	      mailer.sendReportEmail( header + theMail + footer, 'NBA AGC Report :: Confirmed Payments For '+ moment().subtract(1,'d').format('dddd, MMMM Do YYYY'), done );
// 	    } else {
// 	      done();
// 	    }
//
// 	  } else {
// 	    done();
// 	  }
//
// 	});
//
// });
//
// agenda.define('Update Web Transactions For Individuals', function(job, done) {
// 	var cutoff = moment().subtract(2,'h');
// 	Registration.find({completed: true, webpay: true, lastModified: { $lt: cutoff }}, function(err, toResolve){
//
// 		if (err) { job.fail(err); job.save(); done(); }
//
// 		if (toResolve.length) {
// 			_(toResolve).forEach(function(registration) {
//
// 				RegistrationController.querySwitch((registration.regCode+'-'+registration.conferenceFee), registration.conferenceFee, function(error, response, body) {
//
// 					if (!error && response.statusCode === 200) {
//
// 						parseString(body, function (err, result) {
//
// 							if (err) { return; }
//
// 							// result is the JSON OBJECT
// 							result = result.CIPG;
//
// 							if (!result.Error) {
//
// 								// Do Update
// 								result.DateTime = result.Date;
// 								registration.responseGotten = true;
// 								var updated = _.merge(registration, result);
// 							    updated.save();
//
// 							}
// 						});
//
// 					}
// 				});
// 			});
//
// 			done();
// 		} else {
// 			done();
// 		}
// 	});
// });
//
// agenda.define('Update Web Transactions For Groups', function(job, done) {
// 	var cutoff = moment().subtract(2,'h');
// 	Invoice.find({finalized: true, webpay: true, lastModified: { $lt: cutoff }}, function(err, toResolve){
//
// 		if (err) { job.fail(err); job.save(); done(); }
//
// 		if (toResolve.length) {
// 			_(toResolve).forEach(function(invoice) {
//
// 				RegistrationController.querySwitch((invoice.code+'-'+invoice.invoiceAmount), invoice.invoiceAmount, function(error, response, body) {
//
// 					if (!error && response.statusCode === 200) {
//
// 						parseString(body, function (err, result) {
//
// 							if (err) { return; }
//
// 							// result is the JSON OBJECT
// 							result = result.CIPG;
//
// 							if (!result.Error) {
//
// 								// Do Update
// 								result.DateTime = result.Date;
// 								invoice.responseGotten = true;
// 								var updated = _.merge(invoice, result);
// 							    updated.save();
//
// 							}
// 						});
//
// 					}
// 				});
// 			});
//
// 			done();
// 		} else {
// 			done();
// 		}
// 	});
// });
//
// agenda.define('Send Direct Registration Success SMS for Individuals', function(job, done) {
// 	Registration.find({isDirect: true, successTextSent: false, responseGotten: true, paymentSuccessful: true, statusConfirmed: true }, function(err, toResolve){
//
// 		if (err) { job.fail(err); job.save(); done(); }
//
// 		if (toResolve.length) {
// 			_(toResolve).forEach(function(registration) {
//
// 				mailer.sendBankRegistrationSuccessText(registration);
//
// 			});
//
// 			done();
// 		} else {
// 			done();
// 		}
// 	});
// });
//
// agenda.define('Send Direct Registration Success Email for Individuals', function(job, done) {
// 	Registration.find({isDirect: true, successMailSent: false, responseGotten: true, paymentSuccessful: true, statusConfirmed: true }, function(err, toResolve){
//
// 		if (err) { job.fail(err); job.save(); done(); }
//
// 		if (toResolve.length) {
// 			_(toResolve).forEach(function(registration) {
//
// 				mailer.sendBankRegistrationSuccessMail(registration);
//
// 			});
//
// 			done();
// 		} else {
// 			done();
// 		}
// 	});
// });
//
// agenda.define('Send Web Payment Success Email for Individuals', function(job, done) {
// 	Registration.find({webpay: true, successMailSent: false, responseGotten: true, paymentSuccessful: true, statusConfirmed: true }, function(err, toResolve){
//
// 		if (err) { job.fail(err); job.save(); done(); }
//
// 		if (toResolve.length) {
// 			_(toResolve).forEach(function(registration) {
//
// 				mailer.sendWebPaySuccessMail(registration);
//
// 			});
//
// 			done();
// 		} else {
// 			done();
// 		}
// 	});
// });
//
// agenda.define('Send Web Payment Success SMS for Individuals', function(job, done) {
// 	Registration.find({webpay: true, successTextSent: false, responseGotten: true, paymentSuccessful: true, statusConfirmed: true }, function(err, toResolve){
//
// 		if (err) { job.fail(err); job.save(); done(); }
//
// 		if (toResolve.length) {
// 			_(toResolve).forEach(function(registration) {
//
// 				mailer.sendWebPaySuccessText(registration);
//
// 			});
//
// 			done();
// 		} else {
// 			done();
// 		}
// 	});
// });
//
// agenda.define('Send Bank Payment Success Email for Individuals', function(job, done) {
// 	Registration.find({ isDirect: false, bankpay: true, successMailSent: false, responseGotten: true, paymentSuccessful: true, statusConfirmed: true }, function(err, toResolve){
//
// 		if (err) { job.fail(err); job.save(); done(); }
//
// 		if (toResolve.length) {
// 			_(toResolve).forEach(function(registration) {
//
// 				mailer.sendBankPaySuccessMail(registration);
//
// 			});
//
// 			done();
// 		} else {
// 			done();
// 		}
// 	});
// });
//
// agenda.define('Send Bank Payment Success SMS for Individuals', function(job, done) {
// 	Registration.find({ isDirect: false, bankpay: true, successTextSent: false, responseGotten: true, paymentSuccessful: true, statusConfirmed: true }, function(err, toResolve) {
//
// 		if (err) { job.fail(err); job.save(); done(); }
//
// 		if (toResolve.length) {
// 			_(toResolve).forEach(function(registration) {
//
// 				mailer.sendWebPaySuccessText(registration);
//
// 			});
//
// 			done();
// 		} else {
// 			done();
// 		}
// 	});
// });
//
// agenda.define('Send Bank Payment Success Email for Groups', function(job, done) {
// 	Invoice.find({ bankpay: true, successMailSent: false, responseGotten: true, paymentSuccessful: true, statusConfirmed: true })
// 	.populate('_group')
// 	.populate('registrations', '_id firstName middleName surname suffix prefix regCode conferenceFee')
// 	.exec(function(err, toResolve){
//
// 		if (err) { job.fail(err); job.save(); done(); }
//
// 		if (toResolve.length) {
// 			_(toResolve).forEach(function(invoice) {
//
// 				mailer.sendGroupBankPaySuccessMail(invoice);
//
// 			});
//
// 			done();
// 		} else {
// 			done();
// 		}
// 	});
// });
//
// agenda.define('Send Bank Payment Success SMS for Groups', function(job, done) {
// 	Invoice.find({ bankpay: true, successTextSent: false, responseGotten: true, paymentSuccessful: true, statusConfirmed: true })
// 	.populate('_group')
// 	.exec(function(err, toResolve){
//
// 		if (err) { job.fail(err); job.save(); done(); }
//
// 		if (toResolve.length) {
// 			_(toResolve).forEach(function(invoice) {
//
// 				mailer.sendGroupBankPaySuccessText(invoice);
//
// 			});
//
// 			done();
// 		} else {
// 			done();
// 		}
// 	});
// });
//
// agenda.define('Send Web Payment Success Email for Groups', function(job, done) {
// 	Invoice.find({ webpay: true, successMailSent: false, responseGotten: true, paymentSuccessful: true, statusConfirmed: true })
// 	.populate('_group')
// 	.populate('registrations', '_id firstName middleName surname suffix prefix regCode conferenceFee')
// 	.exec(function(err, toResolve){
//
// 		if (err) { job.fail(err); job.save(); done(); }
//
// 		if (toResolve.length) {
// 			_(toResolve).forEach(function(invoice) {
//
// 				mailer.sendGroupWebPaySuccessMail(invoice);
//
// 			});
//
// 			done();
// 		} else {
// 			done();
// 		}
// 	});
// });
//
// agenda.define('Send Web Payment Success SMS for Groups', function(job, done) {
// 	Invoice.find({ webpay: true, successTextSent: false, responseGotten: true, paymentSuccessful: true, statusConfirmed: true })
// 	.populate('_group')
// 	.exec(function(err, toResolve){
//
// 		if (err) { job.fail(err); job.save(); done(); }
//
// 		if (toResolve.length) {
// 			_(toResolve).forEach(function(invoice) {
//
// 				mailer.sendGroupWebPaySuccessText(invoice);
//
// 			});
//
// 			done();
// 		} else {
// 			done();
// 		}
// 	});
// });
//
// // TODO:  Create Accounts for Paid Invoices
// agenda.define('Create Accounts for Paid Invoices', function (job, done) {
// 	Invoice.find({ statusConfirmed: true, paymentSuccessful: true, responseGotten: true, accountsCreated: false })
// 	.populate('registrations')
// 	.exec(function (err, toResolve){
//
// 		if (err) { job.fail(err); job.save(); done(); }
//
// 		if (toResolve.length) {
// 			_(toResolve).forEach(function (invoice) {
//
// 				// Iterate through the registrations in this Invoice and Create Accounts for Each
// 				_(invoice.registrations).forEach(function (registration){
//
// 					// Create User Account Using First Name and Last Name as Username
// 					var username = (registration.firstName + registration.surname).split(' ').join('').toLowerCase();
//
// 					// Find Existing User
// 					User.find({email: username}, function (err, existingUsers) {
//
// 						if (existingUsers.length) {
// 							username += '_'+existingUsers.length;
// 						}
//
// 						var newPass = User.randomString(4).toLowerCase();
//
// 						var user = new User();
// 						user.email = username;
// 						user.password = user.generateHash(newPass);
//
// 						user.save(function() {
//
// 							Invoice.update({ _id: invoice._id }, { $set: { accountsCreated: true } }, function(){ });
//
// 			                Registration.findById(registration._id, function ( err, theReg ){
// 			                    if (theReg) {
//
// 			                        theReg.user = user;
// 			                        theReg.statusConfirmed = true;
// 			                        theReg.responseGotten = true;
// 			                        theReg.paymentSuccessful = true;
// 			                        theReg.webpay = invoice.webpay;
// 			                        theReg.bankpay = invoice.bankpay;
//
// 			                        theReg.PaymentRef = invoice.PaymentRef;
// 			                        theReg.TransactionRef = invoice.TransactionRef;
// 			                        theReg.ResponseDescription = invoice.ResponseDescription;
// 			                        theReg.ResponseCode = invoice.ResponseCode;
// 			                        theReg.PaymentGateway = invoice.PaymentGateway;
// 			                        theReg.Status = invoice.Status;
//
// 			                        theReg.bankDatePaid = invoice.bankDatePaid;
// 			                        theReg.bankTeller = invoice.bankTeller;
// 			                        theReg.bankBranch = invoice.bankBranch;
// 			                        theReg.save(function ( err ) {
//
// 			                            if (err) { job.fail(err); job.save(); done(); }
//
// 			                            // Send Email to the User Here
// 		                                mailer.sendWelcomeMailWithUsername(theReg, newPass, username, function (err){
// 		                                    if (err !== null) { job.fail(err); job.save(); done(); }
//
// 		                                    // Send the text message
// 		                                    mailer.sendRegistrationTextWithUsername(theReg, newPass, username, function (err){
//
// 		                                        if (err!==null) { job.fail(err); job.save(); done(); }
//
// 		                                        done();
// 		                                    });
//
// 		                                });
//
// 			                        });
// 			                    }
// 			                });
//
// 			            });
// 					});
//
// 				});
//
// 			});
//
// 			done();
// 		} else {
// 			done();
// 		}
// 	});
// });
//
// // TODO: Create Accounts for Direct Bank Registrations
// agenda.define('Create Accounts for Direct Bank Registrations', function (job, done) {
// 	Registration.find({bankpay: true, statusConfirmed: true, paymentSuccessful: true, responseGotten: true, isDirect: true, accountCreated: false }, function (err, toResolve){
//
// 		if (err) { job.fail(err); job.save(); done(); }
//
// 		if (toResolve.length) {
//
// 			// Iterate through the registrations and Create Accounts for Each
// 			_(toResolve).forEach(function (registration) {
//
// 				// Create User Account Using First Name and Last Name as Username
// 				var username = (registration.firstName + registration.surname).split(' ').join('').toLowerCase();
//
// 				// Find Existing User
// 				User.find({email: username}, function (err, existingUsers) {
//
// 					if (existingUsers.length) {
// 						username += '_'+existingUsers.length;
// 					}
//
// 					var newPass = User.randomString(4).toLowerCase();
//
// 					var user = new User();
// 					user.email = username;
// 					user.password = user.generateHash(newPass);
//
// 					user.save(function() {
//
// 		                Registration.findById(registration._id, function ( err, theReg ){
// 		                    if (theReg) {
//
// 		                        theReg.user = user;
// 		                        theReg.accountCreated = true;
//
// 		                        theReg.save(function ( err ) {
//
// 		                            if (err) { job.fail(err); job.save(); done(); }
//
// 		                            // Send Email to the User Here
// 	                                mailer.sendWelcomeMailWithUsername(theReg, newPass, username, function (err){
// 	                                    if (err !== null) { job.fail(err); job.save(); done(); }
//
// 	                                    // Send the text message
// 	                                    mailer.sendRegistrationTextWithUsername(theReg, newPass, username, function (err){
//
// 	                                        if (err!==null) { job.fail(err); job.save(); done(); }
//
// 	                                        done();
// 	                                    });
//
// 	                                });
//
// 		                        });
// 		                    }
// 		                });
//
// 		            });
// 				});
//
// 			});
//
// 			done();
// 		} else {
// 			done();
// 		}
// 	});
// });
//
// agenda.define('Create Registration Code', function (job,done) {
// 	Registration.find({ registrationCode: { "$exists": false },paymentSuccessful:true }, function (err,members) {
// 		if (members.length)
// 		{
// 			async.forEachSeries(members, function (member,callback) {
// 				if(member.registrationType =='legalPractitioner')
// 				{
// 					async.series([
// 						function (callback) {
// 							Branch.findOne({name: member.branch}, function (err, branch) {
// 								if(err){
// 									job.fail(err); job.save(); done();
// 									return callback(err);}
// 								member.registrationCode = branch.code + '-' + branch.order;
// 								console.log('member code generated ' + member.registrationCode);
// 								var num = Number(branch.order) + 1;
// 								num = ("000" + num).slice(-4);
// 								branch.order = ''+num;
// 								branch.save();
// 								callback();
// 							});
// 						},
// 						function (callback) {
// 							Registration.update({ _id: member._id }, { $set: { registrationCode: member.registrationCode } }, function(e){
// 								if (e) {
//
// 									console.log(e); }
// 								callback();
// 							});
// 						}
//
// 					],function (err) {
// 						if (err)
// 						{
// 							job.fail(err); job.save(); done();
// 							return next(err);
// 						}
// 						console.log('registrationCode generated'+ member.registrationCode);
// 						callback();
// 					});
//
// 				}
// 				else {
// 					var code = '';
// 					switch (member.registrationType){
// 						case 'law_students':
// 							code = 'NLS';
// 							break;
// 						case 'international':
// 							code = 'INT';
// 							break;
// 						case 'judge':
// 							code = 'VIP';
// 							break;
// 						case 'magistrate':
// 							code = 'VIP';
// 							break;
// 						case 'non_lawyer':
// 							code = 'EXT';
// 							break;
// 						case 'sanAndBench':
// 							code = 'VIP';
// 							break;
// 						case 'others':
// 							code = 'VIP';
// 							break;
// 					}
// 					if(code!='')
// 					{
// 						async.series([
// 							function(callback){
// 								OtherRegCode.findOne({code:code},function(err, code){
//
// 									if(code){
// 										var vipcode = code.code;
// 										var order = code.order;
// 										member.registrationCode = vipcode+'-'+order;
// 										var num = Number(order) + 1;
// 										num = ("000" + num).slice(-4);
// 										code.order = ''+num;
// 										code.save();
// 										callback();
// 									}
// 								});
// 							},
// 							function (callback) {
// 								Registration.update({ _id: member._id }, { $set: { registrationCode: member.registrationCode } }, function(e){
// 									if (e) { console.log(e); }
// 									callback();
// 								});
// 							}
// 						],function (err) {
// 							if (err){ job.fail(err); job.save(); done(); return next(err);}
// 							console.log('registrationCode generated'+ member.registrationCode);
// 							callback();
// 						});
//
// 					}
// 				}
// 			},function(err){
// 				if (err) return next(err);
// 				res.json({
// 					success: true,
// 					message: members.length+' registrationCode was generated.'
// 				});
// 			})
// 			done();
// 		}
// 		else{done();}
// 	});
// });
//
// // Run at 6:59am every Day
// agenda.every('59 6 * * *', 'Send Web Registration Report');
// agenda.every('04 7 * * *',  'Send Confirmed Web Registration Report' );
// agenda.every('07 7 * * *', 'Send Unsuccessful Web Registration Payments Report');
// agenda.every('0.21 hours', 'Delete Incomplete Invoices');
// agenda.every('0.23 hours', 'delete old registrations');
// agenda.every('2.65 hours', 'Create Accounts for Paid Invoices');
// agenda.every('2.70 hours', 'Create Accounts for Direct Bank Registrations');
// agenda.every('11 minutes', 'Update Web Transactions For Individuals');
// agenda.every('12 minutes', 'Update Web Transactions For Groups');
//
// agenda.every('13 minutes', 'Send Web Payment Success Email for Individuals');
// agenda.every('2 minutes',  'Create Registration Code');
// agenda.every('15 minutes', 'Send Web Payment Success SMS for Individuals');
// agenda.every('14 minutes', 'Send Direct Registration Success SMS for Individuals');
// agenda.every('17 minutes', 'Send Direct Registration Success Email for Individuals');
// agenda.every('19 minutes', 'Send Bank Payment Success SMS for Individuals');
// agenda.every('21 minutes', 'Send Bank Payment Success Email for Individuals');
//
// agenda.every('5.02 hours', 'Send Bank Payment Success SMS for Groups');
// agenda.every('5.04 hours', 'Send Bank Payment Success Email for Groups');
// agenda.every('5.06 hours', 'Send Web Payment Success SMS for Groups');
// agenda.every('5.08 hours', 'Send Web Payment Success Email for Groups');
//
// exports.start = function() { agenda.start(); };

'use strict';

var _ = require('lodash'),
    jwt = require('jwt-simple'),
    moment = require('moment'),
    qr = require('qr-image');

var User = require('../../api/user/user.model');
var Registration = require('../../api/registration/registration.model');
var mailer = require('../../components/tools/mailer');
var ObjectId = require('mongoose').Types.ObjectId;

function createJWT(user) {
    
    var payload = {
        sub: user._id,
        email: user.email,
        accountType: user.accountType,
        bag: user.bag,
        groupName: user.groupName!==undefined?user.groupName:null,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, process.env.SESSION_SECRET);
}

function createGroupAccount(req, res) {
    var newPass = req.body.password;
    var user = new User();

    user.email = req.body.email;
    user.password = user.generateHash(newPass);
    user.groupName = req.body.groupName;
    user.phone = req.body.phone;
    user.accountType = 'group';

    user.save(function(err) {
        // Send Email to the User Here
        mailer.sendWelcomeMail(user, newPass, function(err){

            if (err !== null) { return handleError(res, err); }
            return res.status(200).json({statusCode:200, message: 'Account created successfully!' });
    
        });
    });

}

exports.qrCode = function(req, res) {
    var params = { user: new ObjectId(req.query.me), paymentSuccessful: true, statusConfirmed: true };
    Registration.findOne(params, function (err, reg) {
        if(err) { return handleError(res, err); }
        if (!reg) { return res.send(404); }

        var company = reg.registrationType!='judge'&&reg.registrationType!='magistrate'?reg.company:(reg.court+' '+reg.state+' '+reg.division);

        var theData = 'BEGIN:VCARD\nVERSION:3.0\nN:'+reg.surname+';'+reg.firstName+';'+reg.middleName+';;\nFN:'+(reg.firstName+' '+reg.surname+' '+reg.suffix)+'\nORG:'+company+'\nTITLE:'+reg.suffix+'\nEMAIL;type=INTERNET;type=WORK;type=pref:'+reg.email+'\nTEL;type=MOBILE;type=pref:'+reg.mobile+'\nEND:VCARD',
        //var theData = reg.surname+','+reg.firstName+';ADR:'+reg.address+';TEL:'+reg.mobile+';EMAIL:'+reg.email+';',
            code = qr.image(theData, { type: 'svg' });
        res.type('svg');
        code.pipe(res);
    });
};

exports.confirmReset = function(req, res){

    if (req.body.member === undefined || req.body.token === undefined) { return res.status(401).json({message: 'Invalid password reset request. Please go through the password recovery process again.' }); }

    User.findOne({ _id: req.body.member, resetToken: req.body.token }, function(err, theUser) {
        if (err) { handleError(res, err); }

        if (theUser) {

            if (moment().isBefore(theUser.tokenExpires)) {

                return res.status(200).json(theUser);

            } else {

                return res.status(401).json({message: 'Your password reset request has expired. Please make the request again.!'});
            }

        } else {
            return res.status(404).send({ message: 'Invalid request!' });
        }
    });
};

exports.changePassword = function (req, res) {

    if (req.body.password === undefined || req.body.user === undefined) { return res.status(400).json({message: 'Invalid password reset request. Please go through the password recovery process again.' }); }

    User.findById( req.body.user._id, '+password', function(err, theUser) {
        if (err) { handleError(res, err); }

        if (theUser) {

            theUser.password = theUser.generateHash(req.body.password);
            theUser.tokenExpires = moment().subtract(1, 'days').format();
            theUser.resetToken = "";

            theUser.save(function(err){

                if (err!==null) { return handleError(res, err); }

                delete theUser.password;

                return res.status(200).json(theUser);
            });

        } else {
            return res.status(404).send({ message: 'User not found!' });
        }
    });
};

exports.recovery = function(req, res) {

    function sendEmail(theUser) {
        // Send the Email
        mailer.sendRecoveryEmail(theUser, function(err) {
            if (err) { return handleError(res, err); }

            return res.status(200).json({message: 'Password reset mail sent!'});
        });
    }

    User.findOne({ email: req.body.email }, function(err, theUser) {
        if (err) { return handleError(res, err); }

        if (theUser) { 

            // Send Password Reset Email
            theUser.tokenExpires = moment().add(1, 'days').format();
            theUser.resetToken = User.randomString(16);

            theUser.save(function(err) {

                if (err!==null) { return handleError(res, err); }

                if (theUser.email.indexOf('@')<0) {
                    // Retrieve the Confirmed Email of the User from the Registrations Collection
                    Registration.findOne({ user: new ObjectId(theUser._id), statusConfirmed:true }, 'email', function(err, reg){
                        if (err) { return handleError(res, err); }
                        if (!reg) { return res.send(404); }

                        theUser.email = reg.email;

                        return sendEmail(theUser);
                    });
                } else {
                    return sendEmail(theUser);
                }

            });

        }
        else {

            return res.status(401).send({ message: 'The email address you entered does not exist in our records.' });
        }
    });
};

exports.signUp = function(req, res) {

    User.findOne({ email: req.body.email }, function(err, existingUser) {
        if (existingUser) {

            return res.status(409).send({ message: 'This Email Address has been used. If you have registered before, please sign in using the Login button at the top of your screen. If not, please use a different email address.' });

        } else {

            if (req.body.accountType!==undefined && req.body.accountType === 'group') { return createGroupAccount(req, res); }

            var newPass = User.randomString(4).toLowerCase();

            var user = new User();

            user.email = req.body.email;
            user.password = user.generateHash(newPass);

            user.save(function() {

                Registration.findById(req.body._id, function(err, registration){
                    if (registration) {
                        //registration.user = user._id;
                        registration.user = user;
                        registration.accountCreated = true;
                        registration.save(function ( err ) {

                            if (err) { return handleError(res, err); }

                            if (req.body.webmail) {

                                // Send Email to the User Here
                                mailer.sendWelcomeMail(registration, newPass, function(err){
                                    if (err !== null) { return handleError(res, err); }

                                    // Send the text message
                                    mailer.sendRegistrationText(registration, newPass, function(error){
                                        
                                        if (error!==null) { return handleError(res, error); }
                                        
                                        res.send({ token: createJWT(user) });
                                    });
                            
                                });

                            } else {

                                // Send Email to the User Here
                                mailer.sendBankWelcomeMail(registration, newPass, function(err){
                                    if (err !== null) { return handleError(res, err); }

                                    // Send the text message
                                    mailer.sendBankRegistrationText(registration, newPass, function(error){
                                        
                                        if (error!==null) { return handleError(res, error); }
                                        
                                        res.send({ token: createJWT(user) });
                                    });
                            
                                });

                            }

                        });
                    } else {

                        // Remove Account
                        user.remove(function(){
                            res.send({'error':'account created but reg not found!'});
                        });

                    }
                });

            });
        }
    });
};

exports.signIn = function(req, res) {
    User.findOne({ email: req.body.email }, '+password', function(err, user) {
        if (!user) {
            return res.status(401).send({statusCode:401, message: 'Wrong email/username and/or password' });
        }

        user.validPassword(req.body.password, function(err, isMatch) {
            if (!isMatch) {
                return res.status(401).send({statusCode :401, message: 'Wrong email/username and/or password' });
            }
            Registration.findOne({email :req.body.email}).sort('-lastModified').exec(function (err,data) {
                res.status(200).send({statusCode:200,message:'ok', token: createJWT(user), data:data});
            });
        });
    });
};

exports.update = function(req, res) {
    User.findById(req.user, function (err, user) {
        if (err) { return handleError(res, err); }
        if(!user) { return res.send(404); }
        var updated = _.merge(user, _.pick(req.body, ['prefix','suffix','name','firm']));
        updated.hasTag = true;
        updated.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.json(200, user);
        });
    });
};

exports.view = function(req, res) {
    User.findById(req.user, function(err, user) {
        res.send(user);
    });
};

function handleError(res, err) {
    console.log('Auth Endpoint Error: ',err);
  return res.status(500).send({statusCode:500,message: err});
}


exports.getSingle = function(req,res){

    return Registration.findOne({email :req.body.email}).sort('-lastModified').exec(function (err,data) {
        res.send(data);
    });
};
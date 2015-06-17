'use strict';

var _ = require('lodash'),
    jwt = require('jwt-simple'),
    moment = require('moment');

var User = require('../user/user.model');
var Registration = require('../registration/registration.model');
var mailer = require('../../components/tools/mailer');

function createJWT(user) {
    
    var payload = {
        sub: user._id,
        email: user.email,
        accountType: user.accountType,
        groupName: user.groupName!==undefined?user.groupName:null,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, process.env.SESSION_SECRET);
}

function createGroupAccount(req, res) {
    var newPass = req.body.password
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
            return res.status(200).json({ message: 'Account created successfully!' });
    
        });
    });

}

/*exports.oneTimeTask = function(req, res) {
    Registration.find({user: '0'}, function(err, registrations){
        if (err) { return handleError(res, err); }

        console.log('Found ', registrations.length, ' registrations.');

        return _(registrations).forEach(function(registration) {
            // Find User with matching email
            User.findOne({email: registration.email}, function(err, theUser){
                if (err) { return; }

                if (theUser) {

                    registration.user = theUser._id;
                    registration.save(function(){
                        console.log('Updated record: ', registration._id);
                    });
                }
            });
        });
    });
};*/

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
    console.log(req.body);

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

    User.findOne({ email: req.body.email }, function(err, theUser) {
        if (err) { return handleError(res, err); }

        if (theUser) { 

            // Send Password Reset Email
            theUser.tokenExpires = moment().add(1, 'days').format();
            theUser.resetToken = User.randomString(16);

            theUser.save(function(err){

                if (err!==null) { return handleError(res, err); }

                // Send the Email
                mailer.sendRecoveryEmail(theUser, function(err) {
                    if (err) { return handleError(res, err); }

                    return res.status(200).json({message: 'Password reset mail sent!'});
                });

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

            // Allow users to register more than once
            /*Registration.findById(req.body._id, function(err, registration){
                if (registration) {

                    console.log('Found User Registration: ', registration);
                    
                    registration.user = existingUser._id;
                    registration.save(function () {

                       res.send({ token: createJWT(existingUser) });
                    });
                } else {

                    res.send({'message':'Registration info not found!'});

                }
            });*/

            return res.status(409).send({ message: 'This Email Address has been used. If you have registered before, please sign in using the Login button at the top of your screen. If not, please use a different email address.' });
        } else {

            if (req.body.accountType!==undefined && req.body.accountType === 'group') { return createGroupAccount(req, res); }

            var newPass = User.randomString(8);

            var user = new User();

            user.email = req.body.email;
            user.password = user.generateHash(newPass);

            user.save(function() {

                Registration.findById(req.body._id, function(err, registration){
                    if (registration) {
                        registration.user = user._id;
                        registration.save(function ( err ) {

                            if (err) { return handleError(res, err); }

                            // Send Email to the User Here
                            mailer.sendWelcomeMail(registration, newPass, function(err){
                                if (err !== null) { return handleError(res, err); }

                                // Send the text message
                                mailer.sendRegistrationText(registration, newPass, function(error){
                                    
                                    if (error!==null) { return handleError(res, error); }
                                    
                                    res.send({ token: createJWT(user) });
                                });
                        
                            });
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
    console.log(req.body);

    User.findOne({ email: req.body.email }, '+password', function(err, user) {
        if (!user) {
            return res.status(401).send({ message: 'Wrong email and/or password' });
        }

        user.validPassword(req.body.password, function(err, isMatch) {
            if (!isMatch) {
                return res.status(401).send({ message: 'Wrong email and/or password' });
            }
            res.send({ token: createJWT(user) });
        });
    });
};

exports.update = function(req, res) {
    User.findById(req.user, function(err, user) {
        if (!user) {
            return res.status(400).send({ message: 'User not found' });
        }

        user.email = req.body.email || user.email;
        user.save(function(err) {
            res.status(200).end();
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
  return res.send(500, err);
}
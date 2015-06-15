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
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, process.env.SESSION_SECRET);
}


exports.signUp = function(req, res) {

    User.findOne({ email: req.body.email }, function(err, existingUser) {
        if (existingUser) {

            console.log('Found User: ', existingUser);

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

            return res.status(409).send({ message: 'This Email Address has been used. If you have registered before, please sign in using the Login button at the top of your screen. If not, please go back and put in a different email address.' });
        } else {

            var newPass = User.randomString(8);

            var user = new User();

            user.email = req.body.email;
            user.password = user.generateHash(newPass);

            user.save(function() {

                Registration.findById(req.body._id, function(err, registration){
                    if (registration) {
                        registration.user = user._id;
                        registration.save(function () {

                            // Send Email to the User Here
                            mailer.sendWelcomeMail(registration.email, newPass, function(err){
                                if (err !== null) { return handleError(res, err); }

                                // Send the text message
                                mailer.sendRegistrationText(registration, function(error, respponse){

                                    console.log('SMS Send Response: ', respponse);
                                    
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
  return res.send(500, err);
}
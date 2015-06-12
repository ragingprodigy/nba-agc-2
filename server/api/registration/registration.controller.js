'use strict';

var _ = require('lodash'),
    request = require('request');
var Registration = require('./registration.model');
var User = require('../user/user.model');


exports.postPay = function(req, res) {

  request('https://cipg.accessbankplc.com/MerchantServices/TransactionStatusCheck.ashx?MERCHANT_ID =09948&ORDER_ID=' + req.body.orderID + '&CURR_CODE=566&AMOUNT='+ req.body.amount, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.send(body);
    } else {
      console.log(error);
      res.send(error);
    }
  });
};

exports.fetch = function (req, res) {
  
  console.log(req.user);

  res.send([]);
};

// Get list of registrations
exports.index = function(req, res) {
  Registration.find(function (err, registrations) {
    if(err) { return handleError(res, err); }
    return res.json(200, registrations);
  });
};

// Get a single registration
exports.show = function(req, res) {
  Registration.findById(req.params.id, function (err, registration) {
    if(err) { return handleError(res, err); }
    if(!registration) { return res.send(404); }
    return res.json(registration);
  });
};

// Creates a new registration in the DB.
exports.create = function(req, res) {
    // Check the
  Registration.create(req.body, function(err, registration) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(registration);
  });
};

// Updates an existing registration in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Registration.findById(req.params.id, function (err, registration) {
    if (err) { return handleError(res, err); }
    if(!registration) { return res.send(404); }
    var updated = _.merge(registration, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(registration);
    });
  });
};

// Deletes a registration from the DB.
exports.destroy = function(req, res) {
  Registration.findById(req.params.id, function (err, registration) {
    if(err) { return handleError(res, err); }
    if(!registration) { return res.send(404); }
      //Remove User for this Registration
      User.findById(registration.user, function(err, user){
          if (!registration.completed) {
              if (user) {
                  user.remove();
              }

              registration.remove(function(err) {
                  if(err) { return handleError(res, err); }
                  return res.send(204);
              });
          } else {
              return res.send(204);
          }
      });

  });
};

function handleError(res, err) {
    console.log(err);
  return res.status(500).send(err);
}
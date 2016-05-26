'use strict';

var _ = require('lodash'),
    request = require('request');
var Registration = require('./registration.model'),
    User = require('../user/user.model'),
    Invoice = require('../invoice/invoice.model'),
    Branch = require('./branches.model'),
    OtherRegCode = require('./othersRegCode.model'),
    parseString = require('xml2js').parseString,
    moment = require('moment');

var ObjectId = require('mongoose').Types.ObjectId; 

function postPay (orderID, amount, callback) {

  request('https://cipg.accessbankplc.com/MerchantServices/TransactionStatusCheck.ashx?MERCHANT_ID=09948&ORDER_ID=' + orderID + '&CURR_CODE=566&AMOUNT=' + amount , function (error, response, body) {
    
    callback(error, response, body);

  });
}

exports.querySwitch = function(a, b, c){
  return postPay(a, b, c);
};

exports.postPay = function(req, res) {

  postPay( req.body.orderID, req.body.amount , function (error, response, body) {
    if (!error && response.statusCode === 200) {
      return res.send(body);
    } else {
      return handleError(res, error);
    }
  });

};

exports.webPayStatus = function (req, res) {

  if (req.body.which && req.body.which==='invoice') {

    Invoice.findById( req.body._id, function(err, invoice) {
      if (err) { return handleError(res, err); }

      postPay( invoice.code+'-'+invoice.invoiceAmount, invoice.invoiceAmount, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          return res.send(body);
        } else {
          return handleError(res, error);
        }
      });
    });

  } else {

    Registration.findById( req.body._id, function(err, registration) {
      if (err) { return handleError(res, err); }

      postPay( registration.regCode+'-'+registration.conferenceFee, registration.conferenceFee , function (error, response, body) {
        if (!error && response.statusCode === 200) {
          return res.send(body);
        } else {
          return handleError(res, error);
        }
      });
    });

  }
};

// Get the Confirmed payment for the Current User
exports.fetch = function (req, res) {

    var params = { user: new ObjectId(req.user), paymentSuccessful: true, statusConfirmed: true };

    Registration.findOne(params, function (err, registration) {
        if(err) { return handleError(res, err); }
        return res.status(200).json(registration);
    });
};
// get list of branches
exports.branch = function (req, res) {
  Branch.find(function (err, branch) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json({statusCode:200,message:'ok', data:branch});
  });
};
//get vip and law student registration code
exports.otherCode = function(req,res){
  OtherRegCode.find({code:req.body.code},function(err, code){
    if(err) {return handleError(res,err);}
    if (!code) {return res.send(404);}
    if(code){
      var vipcode = code[0].code;
      var order = code[0].order;
      return res.status(200).json(vipcode+'-'+order);
    }
  });
};

// Get a single branch
exports.oneBranch = function(req, res) {
  Branch.find({name: req.body.branch}, function (err, branch) {
    if(err) { return handleError(res, err); }
    if(!branch) { return res.send(404); }
    console.log();
    return res.json(branch);
  });
};

// update code in order column of Branch table
exports.saveOrderBranch = function (req,res) {
    Branch.findOne({name: req.body.branch}, function (err, doc) {
      var str = req.body.registrationCode;
      var arr = str.split('-');
      var num = Number(arr[1]) + 1;
      num = ("000" + num).slice(-4);
      doc.order = '' + num;
      doc.save();
    });
};

exports.saveVipCode = function (req,res) {
  var str = req.body.code;
  var arr = str.split('-');
  var num = Number(arr[1]) + 1;
  num = ("000" + num).slice(-4);
  OtherRegCode.findOne({code: ''+arr[0]}, function (err, doc) {
    doc.order = '' + num;
    doc.save();
  });
};

// Get list of registrations
exports.index = function(req, res) {
    var params = {};

    if (req.query.isGroup) {
        params = { owner: new ObjectId(req.user) };
    } else {
        params = { user: new ObjectId(req.user) };
    }

  Registration.find(params, function (err, registrations) {
    if(err) { return handleError(res, err); }

    return res.status(200).json(registrations);
  });
};

// Get list of confirmed Registrations
exports.attendees = function(req, res) {
    Registration.find({paymentSuccessful:true, statusConfirmed:true, completed:true}, function (err, registrations) {
        if(err) { return handleError(res, err); }

        return res.status(200).json(registrations);
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

    if (moment().isAfter(process.env.CUTOFF)) { return res.status(400).json({statusCode:400,message: 'Registration Has Closed'}); }

  req.body.regCode = Registration.pRef(5);

    // Check the
  Registration.create(req.body, function(err, registration) {
    if(err) { return handleError(res, err); }
    return res.status(201).json({statusCode:201,message:'ok',data : registration});
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

// Create a Fresh Registration from an old one
exports.clone = function(req, res) {

    if (moment().isAfter(process.env.CUTOFF)) { return res.status(400).json({message: 'Registration Has Closed'}); }

  if (String(req.body._id) !== String(req.params.id)) { return res.status(400).json({ message:'Invalid request' }); }

  var r = new Registration();

  // Find the Old Registration
  Registration.findById(req.body._id, function(err, oldReg) {
    if (err) { return handleError(res, err); }

    if (oldReg) {
      r.formFilled = true;
      r.responseGotten = false;
      r.group = oldReg.group;
      r.conferenceFee = oldReg.conferenceFee;
      r.registrationType = oldReg.registrationType;
      r.yearCalled = oldReg.yearCalled;
      r.nbaId = oldReg.nbaId;
      r.branch = oldReg.branch;
      r.division = oldReg.division;
      r.state = oldReg.state;
      r.court = oldReg.court;
      r.designation = oldReg.designation;
      r.company = oldReg.company;
      r.address = oldReg.address;
      r.mobile = oldReg.mobile;
      r.phone = oldReg.phone;
      r.email = oldReg.email;
      r.suffix = oldReg.suffix;
      r.prefix = oldReg.prefix;
      r.surname = oldReg.surname;
      r.middleName = oldReg.middleName;
      r.firstName = oldReg.firstName;
      r.user = oldReg.user;
      r.member = oldReg.member;
      r.country = oldReg.country;
      r.international = oldReg.international;
      r.regCode = Registration.pRef();
      r.registrationCode = oldReg.registrationCode;

      r.save(function(err) {
        if (err) { return handleError(res, err); }

        return res.status(201).json(r);
      });
    } else { return res.status(404).json({message:'Registration not found!'}); }
  });

};

// Deletes a registration from the DB.
exports.destroy = function(req, res) {

    if (moment().isAfter(process.env.CUTOFF)) { return res.status(400).json({message: 'Registration Has Closed'}); }

  Registration.findById(req.params.id, function (err, registration) {
    if(err) { return handleError(res, err); }
    if(!registration) { return res.send(404); }
      if (registration.completed && registration.statusConfirmed) { return res.status(400).json({message: 'Cannot delete this registration because it has been confirmed'}); }

      if (req.user || (registration.webpay || registration.bankpay)) {
        // Prevent logged in users from doing nefarious things like deleting other
        // people's registrations
        if ((registration.user !== req.user) && (registration.owner !== req.user)) { return res.status(400).json({message: 'You cannot delete this registration!'}); }
      }
      registration.remove(function(err) {
          if(err) { return handleError(res, err); }
          return res.send(204);
      });
  });
};

function handleError(res, err) {
    console.log(err);
  return res.status(500).send({statusCode:500, message:err.message, data:err});
}
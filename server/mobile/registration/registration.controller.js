'use strict';

var _ = require('lodash'),
    request = require('request');
var Registration = require('../../api/registration/registration.model'),
    User = require('../../api/user/user.model'),
    Invoice = require('../../api/invoice/invoice.model'),
    Branch = require('../../api/registration/branches.model'),
    OtherRegCode = require('../../api/registration/othersRegCode.model'),
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
// exports.index = function(req, res) {
//     var params = {};
//
//     if (req.query.isGroup) {
//         params = { owner: new ObjectId(req.user) };
//     } else {
//         params = { user: new ObjectId(req.user) };
//     }
//
//   Registration.find(params, function (err, registrations) {
//     if(err) { return handleError(res, err); }
//
//     return res.status(200).json(registrations);
//   });
// };

exports.groupUsers = function(req, res) {
  var params = { owner: new ObjectId(req.body.groupId) };

  Registration.find(params, '_id conferenceFee paymentSuccessful nbaId firstName' +
      ' middleName surname yearCalled',function (err, registrations) {
    if(err) { return handleError(res, err); }

    return res.status(200).json({statusCode:200,message:'ok',data:registrations});
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

  Registration.create(req.body).then(function(registration,err) {
    if(err) { return handleError(res, err); }
    setTimeout(function () {
      if(!registration.isGroup)
      {
        Registration.findById(registration._id, function (err, data) {
          if (err) { return handleError(res, err); }
          return res.status(201).json({statusCode:201,message:'ok',data : data});
        });
      }
      else {
        Registration.find({owner : registration.owner},'_id conferenceFee paymentSuccessful nbaId firstName' +
            ' middleName surname', function (err, data) {
          if (err) { return handleError(res, err); }
          return res.status(201).json({statusCode:201,message:'ok',data : data});
        });
      }
    },1500);
    

  });
};

// Updates an existing registration in the DB.
exports.update = function(req, res) {
  if(req.body.webpay || req.body.bankpay)
  {
    req.body.regCode = Registration.pRef();
  }

  if(req.body.Status) {
    delete req.body.MerchantID;
    delete req.body.OrderID;
    delete req.body.CurrencyCode;
    delete req.body.AmountIntegrityCode;
    req.body.DateTime = req.body.Date;
    delete req.body.StatusCode;
    delete req.body.Date;
  }

  if(req.body._id) { delete req.body._id; }
  Registration.findById(req.params.id, function (err, registration) {
    if (err) { return handleError(res, err); }
    if(!registration) { return res.send(404); }
    var updated = _.merge(registration, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json({statusCode:200,data:registration});
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

    if (moment().isAfter(process.env.CUTOFF)) { return res.send({statusCode:400,message: 'Registration' +
    ' Has' +
    ' Closed'}); }

  Registration.find({owner:req.body.groupId, _id:req.body._id, paymentSuccessful:false}, function (err, registration) {
    if(err) { return handleError(res, err); }
    if(!registration) { return res.send({statusCode:404,message: 'registration not found'}); }
      if (registration.completed && registration.statusConfirmed) { return res.send({statusCode:400,message: 'Cannot delete this registration because it has been confirmed'}); }

      Registration.remove({_id:req.body._id},function(err) {
          if(err) { return handleError(res, err); }
          return res.send({statusCode:204,message:'successfully deleted registration data'});
      });
  });
};

function handleError(res, err) {
    console.log(err);
  return res.status(500).send({statusCode:500, message:err.message, data:err});
}
'use strict';

var _ = require('lodash');
var Invoice = require('../../api/invoice/invoice.model'),
    moment = require('moment'),
    Registration = require('../../api/registration/registration.model');

// Get list of invoices
// exports.index = function(req, res) {
//   Invoice.find({_group: req.user})
//   .populate({
//     path: '_group', match: { _id: req.user }
//   })
//   .populate('registrations', '_id firstName middleName surname conferenceFee email mobile suffix prefix branch yearCalled')
//   .exec(function (err, invoices) {
//     if(err) { return handleError(res, err); }
//
//     return res.status(200).json(invoices);
//   });
// };

// Get a single invoice
exports.show = function(req, res) {
  Invoice.findById(req.params.id)
  .populate({
    path: '_group', match: { _id: req.user }
  })
  .populate('registrations', '_id firstName middleName surname conferenceFee email mobile suffix prefix branch yearCalled')
  .exec(function (err, invoice) {
    if(err) { return handleError(res, err); }
    if(!invoice) { return res.send(404); }

    return res.json(invoice);
  });
};

// Creates a new invoice in the DB.
exports.create = function(req, res) {

    if (moment().isAfter(process.env.CUTOFF)) { return res.status(400).json({statusCode: 400, message: 'Registration' +
    ' Has Closed'}); }

  //get existing unpaid registration for the group if exist
  Invoice.findOne({finalized:true, _group:req.body.groupId, paymentSuccessful:false}).sort('invoiceDate').exec(function (err,data) {
    if(err){return handleError(res,err);}
    if(!data){
      if (req.body.registrations) {
        Registration.where('_id').in(req.body.registrations)
            .exec(function (err, records) {
              if (err) { return handleError(res, err); }
              if (records && records.length) {

                // Create the new Invoice
                Invoice.create(req.body, function(err, invoice) {
                  if(err) { return handleError(res, err); }

                  var invoiceAmount = 0;

                  // Sort out amount on Invoice
                  for (var _i=0; _i<records.length; _i++) {
                    invoiceAmount += records[_i].conferenceFee;
                  }

                  // Update Invoice Amount
                  invoice.invoiceAmount = invoiceAmount;
                  invoice._group = req.body.groupId;
                  invoice.code = Invoice.pRef();

                  // Update the Invoice
                  invoice.save(function(){
                    Invoice.find({_id:invoice._id})
                        .populate({
                          path: '_group', match: { _id: req.body.groupId }
                        })
                        .populate('registrations', '_id firstName middleName surname conferenceFee email mobile suffix prefix branch yearCalled')
                        .exec(function (err, invoice) {
                          if(err) { return handleError(res, err); }
                          if(!invoice) { return res.send({statusCode:404,message:'No invoice found please try' +
                          ' creating again'}); }

                          return res.send({statusCode:201, message:'Invoice created', data:invoice});
                        });

                  });

                });

              } else {
                return res.send({statusCode: 400,message: 'Registration Details not found. Cannot create Invoice!'});
              }
            });
      } else {
         return res.status(400).send({statusCode:400, message: 'Invalid Request!'});
      }
    }
      if(data)
      {
        Invoice.find({_id:data._id})
            .populate({
              path: '_group', match: { _id: req.body.groupId }
            })
            .populate('registrations', '_id firstName middleName surname conferenceFee email mobile suffix prefix branch yearCalled')
            .exec(function (err, invoice) {
              if(err) { return handleError(res, err); }
              if(!invoice) { return res.send(404); }

              return res.send({statusCode: 304, message: 'cannot create new invoice because of pending unpaid' +
              ' invoice', data: invoice});
            });
      }

  });

};

// Updates an existing invoice in the DB.
exports.update = function(req, res) {

  if(req.body._id) { delete req.body._id; }
  Invoice.findById(req.params.id, function (err, invoice) {
    if (err) { return handleError(res, err); }
    if(!invoice) { return res.send(404); }
    var updated = _.merge(invoice, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, invoice);
    });
  });
};

// Deletes a invoice from the DB.
exports.destroy = function(req, res) {
  Invoice.findById(req.body.invoiceId, function (err, invoice) {
    if(err) { return handleError(res, err); }
    if(!invoice) { return res.send(404); }

    if(String(invoice._group) !== String(req.body.groupId)) { return res.send({statusCode:403, message: 'You cannot' +
    ' delete this invoice!'});}

      Invoice.remove({_id:req.body.invoiceId},function(err) {
        if(err) { return handleError(res, err); }
        return res.send({statusCode:204, message:'invoice deleted successfully'});
      });
  });
};

function handleError(res, err) {
  return res.send({statusCode:500, message:err});
}
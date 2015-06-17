'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var pRef = require('../../components/tools/pRef');

var InvoiceSchema = new Schema({
  code    : {
  	type: String,
  	default: pRef()
  },
  invoiceAmount : { type: Number, default: 0 },
  invoiceDate     : {
  	type: Date,
  	default: Date.now
  },
  webpay: { type: Boolean, default: false },
  bankpay: { type: Boolean, default: false },
  finalized: { type: Boolean, default: false },
  paymentSuccessful: { type: Boolean, default: false },
  responseGotten: { type: Boolean, default: false },
  lastModified: {
    type: Date,
    default: Date.now
  },
  TransactionRef:  { type:String, default: "" },
  PaymentRef:  { type:String, default: "" },
  PaymentGateway:  { type:String, default: "" },
  Status:  { type:String, default: "" },
  ResponseCode:  { type:String, default: "" },
  ResponseDescription:  { type:String, default: "" },
  DateTime:  { type:String, default: "" },
  Amount:  { type:String, default: "" },
  AmountDiscrepancyCode:  { type:String, default: "" },
  bankAccount:  { type:String, default: "" },
  bankDeposit:  { type:Number, default: 0 },
  bankDatePaid:  { type:String, default: "" },
  statusConfirmed: { type: Boolean, default: false },
  _group : { type: Schema.Types.ObjectId, ref: 'User' },
  registrations : [{ type: Schema.Types.ObjectId, ref: 'Registration' }]
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Member = require('../member/member.model'),
    User = require('../user/user.model');

var pRef = require('../../components/tools/pRef');

var RegistrationSchema = new Schema({
  member: { type:String, default: 0 },
  user : { type: Schema.Types.ObjectId, ref: 'User' },
  owner : { type: Schema.Types.ObjectId, ref: 'User' },
    sponsor : { type: Schema.Types.ObjectId, ref: 'Sponsor' },
  prefix: { type:String, default: "" },
  firstName:  { type:String, default: "" },
  middleName:  { type:String, default: "" },
  surname:  { type:String, default: "" },
  suffix:  { type:String, default: "" },
  email:  { type:String, default: "", lowercase: true },
  phone:  { type:String, default: "" },
  mobile:  { type:String, default: "" },
  address:  { type:String, default: "" },
  company:  { type:String, default: "" },
  designation:  { type:String, default: "" },
  court:  { type:String, default: "" },
  state:  { type:String, default: "" },
  division:  { type:String, default: "" },
  branch:  { type:String, default: "" },
  nbaId:  { type:String, default: "" },
  yearCalled: {
    type: String,
    default: 1960
  },
  regCode: {
    type:String,
    unique: true,
    default: pRef()
  },
  registrationType: {
    type:String,
    default: "legalPractitioner"
  },
  group:  {
    san: { type: Boolean, default: false },
    ag: { type: Boolean, default: false },
    bencher: { type: Boolean, default: false }
  },
  conferenceFee: {
    type: Number,
    default: 0
  },
  formFilled: {
    type: Boolean,
    default: false
  },
  completed: {
    type: Boolean,
    default: false
  },
  webpay: {
    type: Boolean,
    default: false
  },
  bankpay: {
    type: Boolean,
    default: false
  },
  paymentSuccessful: {
    type: Boolean,
    default: false
  },
  isGroup: {
    type: Boolean,
    default: false
  },
  isDirect: {
    type: Boolean,
    default: false
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  successMailSent: {
    type: Boolean,
    default: false
  },
  successTextSent: {
    type: Boolean,
    default: false
  },
  accountCreated: {
    type: Boolean,
    default: false
  },
  country:  { type:String, default: "" },
  TransactionRef:  { type:String, default: "" },
  PaymentRef:  { type:String, default: "" },
  PaymentGateway:  { type:String, default: "" },
  Status:  { type:String, default: "" },
  ResponseCode:  { type:String, default: "" },
  ResponseDescription:  { type:String, default: "" },
  DateTime:  { type:String, default: "" },
  Amount:  { type:String, default: 0 },
  AmountDiscrepancyCode:  { type:String, default: "" },
  bankAccount:  { type:String, default: "" },
  bankDeposit:  { type:String, default: 0 },
  bankDatePaid:  { type:String, default: "" },
  bankBranch:  { type:String, default: "" },
  bankTeller:  { type:String, default: "" },
  statusConfirmed: { type: Boolean, default: false },
  international: { type: Boolean, default: false },
  responseGotten: { type: Boolean, default: false }
});

RegistrationSchema.statics.pRef = pRef;

RegistrationSchema.post('save', function(entry){

    var Registration = entry.constructor;


    if (['00', '0', '001', 'APPROVED'].indexOf(entry.ResponseCode) !== -1) {
        
        Registration.update({ _id: entry._id }, { $set: { statusConfirmed: true } }, function(e){
           if (e) { console.log(e); }
         });
        Registration.update({ _id: entry._id }, { $set: { paymentSuccessful: true } }, function(e){
           if (e) { console.log(e); }
         });
    }

       var feeDue = 0;

    // Only Calculate the Conference Fee if the Registration is a new one
   if (entry.registrationType === 'legalPractitioner') {
       // Calculate the cost and save
       Registration.findById(entry._id, function (err, member) {
           if (!!err) return;
           if (member) {
               console.log(member);
             var currentYear = new Date().getFullYear();
             var atTheBar = currentYear - member.yearCalled;
             feeDue = 50000;
             if (atTheBar <= 5) { feeDue = 8000; }
             else if (atTheBar <= 10) { feeDue = 15000; }
             else if (atTheBar <= 14) { feeDue = 20000; }
             else if (atTheBar <= 20) { feeDue = 30000; }

               console.log(atTheBar);
             Registration.update({ _id: entry._id }, { $set: { conferenceFee: feeDue} }, function(e){
              return;
             });
           }
       });
   } else {

       switch (entry.registrationType) {
           case 'sanAndBench':
               feeDue = 100000;
               break;
           case 'judge':
               feeDue = 75000;
               break;
           case 'magistrate':
               feeDue = 50000;
               break;
           case 'others':
               feeDue = 250000;
               break;
           case 'non_lawyer':
               feeDue = 25000;
               break;
           case 'international':
               feeDue = 200;
               break;
           case 'access_bank_test':
              feeDue = 100;
              break;
       }

       Registration.update({ _id: entry._id }, { $set: { conferenceFee: feeDue } }, function(e){
          return;
       });
   }
});

module.exports = mongoose.model('Registration', RegistrationSchema);
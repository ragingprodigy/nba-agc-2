'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Member = require('../member/member.model'),
    User = require('../user/user.model');

var pRef = require('../../components/tools/pRef');

var RegistrationSchema = new Schema({
  member: { type:String, default: 0 },
  user : { type: Schema.Types.ObjectId, ref: 'User' },
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
  /*emergencyContact:  { type:String, default: "" },
  emergencyPhone:  { type:String, default: "" },*/
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
  Amount:  { type:String, default: 0 },
  AmountDiscrepancyCode:  { type:String, default: "" },
  bankAccount:  { type:String, default: "" },
  bankDeposit:  { type:String, default: 0 },
  bankDatePaid:  { type:String, default: "" },
  statusConfirmed: { type: Boolean, default: false },
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

    /*if (entry.user === '0' || entry.user === '') {

      // find the user with the same email and update the id
      User.findOne({email: entry.email}, function(err, theUser){
        if (theUser) {
          //Registration.update({ _id: entry._id }, { $set: { user: theUser._id.toString() } }, function(e){
          Registration.update({ _id: entry._id }, { $set: { user: theUser } }, function(e){
            if (e) { console.log(e); }
           });
        }
      });

    }*/

   if (entry.registrationType === 'legalPractitioner') {
       // Calculate the cost and save
       Member.findById(entry.member, function(err, member){
           if (!!err) return;
           var currentYear = new Date().getFullYear();
           var atTheBar = currentYear - member.yearCalled;
           var feeDue = 50000;

           if (atTheBar <= 5) { feeDue = 8000; }
           else if (atTheBar <= 10) { feeDue = 15000; }
           else if (atTheBar <= 14) { feeDue = 20000; }
           else if (atTheBar <= 20) { feeDue = 30000; }

           Registration.update({ _id: entry._id }, { $set: { yearCalled: member.yearCalled } }, function(e){
            return;
           });
           Registration.update({ _id: entry._id }, { $set: { conferenceFee: feeDue} }, function(e){
            return;
           });
       });
   } else {
       var feeDue = 0;

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
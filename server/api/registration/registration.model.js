'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Member = require('../member/member.model');

var RegistrationSchema = new Schema({
  member: Schema.ObjectId,
  prefix: { type:String, default: "" },
  firstName:  { type:String, default: "" },
  middleName:  { type:String, default: "" },
  surname:  { type:String, default: "" },
  suffix:  { type:String, default: "" },
  email:  { type:String, default: "" },
  phone:  { type:String, default: "" },
  mobile:  { type:String, default: "" },
  address:  { type:String, default: "" },
  company:  { type:String, default: "" },
  court:  { type:String, default: "" },
  state:  { type:String, default: "" },
  division:  { type:String, default: "" },
  registrationType: {
      type:String,
      default: "legalPractitioner"
  },
  emergencyContact:  { type:String, default: "" },
  emergencyPhone:  { type:String, default: "" },
  conferenceFee: {
      type: Number,
      default: 0
  },
  yearCalled: {
      type: Number,
      default: 1960
  },
  completed: {
      type: Boolean,
      default: false
  },
  lastModified: {
      type: Date,
      default: Date.now
  }
});

RegistrationSchema.post('save', function(entry){
   if (entry.registrationType == 'legalPractitioner') {
       // Calculate the cost and save
       Member.findById(entry.member, function(err, member){
           if (err) return;
           var currentYear = new Date().getFullYear();
           var atTheBar = currentYear - member.yearCalled;
           var feeDue = 50000;

           if (atTheBar <= 5) { feeDue = 8000; }
           else if (atTheBar <= 10) { feeDue = 15000; }
           else if (atTheBar <= 14) { feeDue = 20000; }
           else if (atTheBar <= 20) { feeDue = 30000; }

           entry.lastModified = new Date();
           entry.yearCalled = member.yearCalled;
           entry.conferenceFee = feeDue;
           entry.save();
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
               feeDue = 50000;
               break;
       }

       entry.lastModified = new Date();
       entry.conferenceFee = feeDue;
       entry.save();
   }
});

module.exports = mongoose.model('Registration', RegistrationSchema);
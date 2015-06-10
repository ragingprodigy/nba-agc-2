'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MemberSchema = new Schema({
  firstName: String,
  middleName: String,
  surname: String,
  yearCalled: String,
  branch: String,
  nbaId: String,
  active: Boolean
});

module.exports = mongoose.model('Member', MemberSchema);
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MemberSchema = new Schema({
  name: String,
  yearCalled: Number,
  nbaId: String,
});

module.exports = mongoose.model('Member', MemberSchema);
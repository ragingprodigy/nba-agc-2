'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SpeakerSchema = new Schema({
  title: {
      type: String,
      default: ''
  },
  name: String,
  suffix: {
      type: String,
      default: ''
  },
  email: {
      type: String,
      lowercase: true
  },
  phone: String,
  organization: String,
  photo: String,
  bio: String
});


module.exports = mongoose.model('Speaker', SpeakerSchema);
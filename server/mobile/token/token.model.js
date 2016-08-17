
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PushSchema = new Schema({
    token: String
});

module.exports = mongoose.model('Token', PushSchema);
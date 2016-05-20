'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var otherscodeSchema = new Schema({
    _id: mongoose.Schema.ObjectId,
    code: String,
    order: String
});

module.exports = mongoose.model('OtherRegCode', otherscodeSchema, 'othersRegcode');
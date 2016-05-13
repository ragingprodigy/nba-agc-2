'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BranchesSchema = new Schema({
    _id: mongoose.Schema.ObjectId,
    name: String,
    state: String
});

module.exports = mongoose.model('Branch', BranchesSchema, 'branches');
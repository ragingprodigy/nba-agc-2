/**
 * Created by oladapo on 8/9/15.
 */
'use strict';

var mongoose = require('mongoose'),
    Rating = require('./rating.model'),
    findOrCreate = require('mongoose-findorcreate'),
    Schema = mongoose.Schema;

var AttendeeSchema = new Schema({
    user : { type: Schema.Types.ObjectId, ref: 'User' },
    session : { type: Schema.Types.ObjectId, ref: 'Session' }
});

AttendeeSchema.plugin(findOrCreate, {});

module.exports = mongoose.model('Attendee', AttendeeSchema);
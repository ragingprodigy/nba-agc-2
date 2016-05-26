/**
 * Created by oladapo on 8/9/15.
 */

'use strict';

var mongoose = require('mongoose'),
    findOrCreate = require('mongoose-findorcreate'),
    Schema = mongoose.Schema;

var RatingSchema = new Schema({
    comment: String,
    score: Number,
    user : { type: Schema.Types.ObjectId, ref: 'User' },
    session : { type: Schema.Types.ObjectId, ref: 'Session' }
});

RatingSchema.plugin(findOrCreate, {});

module.exports = mongoose.model('Rating', RatingSchema);
/**
 * Created by radiumrasheed on 8/12/16.
 *
 * Added for the purpose of live feed on the mobile app
 *
 */

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LiveFeedSchema = new Schema({
    tweet: String,
    tweet_time: {type: Date, default: Date.now},
    star: {type: Number, default: 0},
    comment_count: {type: Number, default: 0},
    _author: {type: Schema.Types.ObjectId, ref: 'User'},
    _session: {type: Schema.Types.ObjectId, ref: 'Session'},
    _speaker: {type: Schema.Types.ObjectId, ref: 'Speaker'},
    comments: [{
        email: String,
        fullname: String,
        content: String,
        comment_date: Date
    }]
});

module.exports = mongoose.model('LiveFeed', LiveFeedSchema);
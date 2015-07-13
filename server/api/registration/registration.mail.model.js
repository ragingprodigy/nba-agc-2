/**
 * Created by oladapo on 6/11/15.
 */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var RegistrationMailSchema = new Schema({
    id: { type:String, default: "" },
    status: { type:String, default: "" },
    reject_reason: { type:String, default: "" },
    email: { type:String, default: "" },
    dateSent: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('RegistrationMail', RegistrationMailSchema);
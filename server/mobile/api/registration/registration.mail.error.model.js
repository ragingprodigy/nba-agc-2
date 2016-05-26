/**
 * Created by oladapo on 6/11/15.
 */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var TheSchema = new Schema({
    name: { type:String, default: "" },
    message: { type:String, default: "" },
    dateAdded: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('RegistrationMailError', TheSchema);
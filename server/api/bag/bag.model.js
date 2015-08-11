/**
 * Created by oladapo on 8/10/15.
 */

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BagSchema = new Schema({
    name: String,
    image : String,
    quantity : Number
});

module.exports = mongoose.model('Bag', BagSchema);
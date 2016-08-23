'use strict';

var _ = require('lodash');
var Speaker = require('./speaker.model');

// Get list of speakers
exports.index = function(req, res) {
  Speaker.find({}, '-photo_base64', function (err, speakers) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(speakers);
  });
};

// Get a single speaker
exports.show = function(req, res) {
  Speaker.findById(req.params.id, function (err, speaker) {
    if(err) { return handleError(res, err); }
    if(!speaker) { return res.send(404); }
    return res.json(speaker);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
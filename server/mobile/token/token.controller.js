'use strict';

var _ = require('lodash');
var Token = require('./token.model'),
    moment = require('moment');

function renderSession(session, res) {
    session.getRatings(function(err, ratings){
        session = session.toObject();
        session.ratings = ratings;
        return res.json(session);
    });
}

// Get list of sessions
exports.index = function(req, res) {
        Token.find({},function (err, tokens) {
            if(err) { return handleError(res, err); }
            return res.json(tokens);
        });
};

// exports.show = function(req, res) {
//   var fields = (req.query.lean?'-photo_base64':'');
//
//   Session.findById(req.params.id)
//   .populate('speakers', fields)
//   .populate({
//       'path':'papers.speaker',
//       'select':'name email title suffix _id'
//   })
//   .exec(function (err, session) {
//     if(err) { return handleError(res, err); }
//     if(!session) { return res.send(404); }
//     return renderSession(session, res);
//   });
// };


// Creates a new session in the DB.
exports.create = function(req, res) {
  Token.create(req.body, function(err, token) {
    if(err) { return handleError(res, err); }
    return res.json(201, token);
  });
};

// Updates an existing session in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Token.findById(req.params.id, function (err, token) {
    if (err) { return handleError(res, err); }
    if(!token) { return res.send(404); }
    var updated = _.merge(token, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, token);
    });
  });
};

// Deletes a session from the DB.
exports.destroy = function(req, res) {
  Token.findById(req.params.id, function (err, token) {
    if(err) { return handleError(res, err); }
    if(!token) { return res.send(404); }
    token.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
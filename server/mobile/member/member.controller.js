'use strict';

var _ = require('lodash');
var Member = require('../../api/member/member.model');

// Get the details of a member From either the Verified List or General List
exports.verify = function(req, res) {

    var n_sn = new RegExp(req.body.nbSurname, 'i');

    Member.find().or([ { 'name': { $regex: n_sn }} ]).exec(function(err, members) {
        if (err) return handleError(res, err);
        return res.status(200).json(members);
    });
};


exports.getMember = function (req, res) {

    var surname = new RegExp(req.body.surname + '*', 'i');
    var firstname = new RegExp(req.body.firstName + '*', 'i');

    Member.find().and([{'name': surname}, {'name': firstname}]).exec(function (err, members) {
        if (err) return handleError(res, err);
        return res.status(200).json({statusCode:200,message:'ok',data:members});
    });
};

// Creates a new member in the DB.
exports.create = function (req, res) {
    Member.create(req.body, function (err, member) {
        if (err) {
            return handleError(res, err);
        }
        return res.status(201).json(member);
    });
};
/*
// Get list of members
exports.index = function(req, res) {
  Member.find(function (err, members) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(members);
  });
};

// Get a single member
exports.show = function(req, res) {
  Member.findById(req.params.id, function (err, member) {
    if(err) { return handleError(res, err); }
    if(!member) { return res.send(404); }
    return res.json(member);
  });
};



 // Updates an existing member in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Member.findById(req.params.id, function (err, member) {
    if (err) { return handleError(res, err); }
    if(!member) { return res.send(404); }
    var updated = _.merge(member, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(member);
    });
  });
};

// Deletes a member from the DB.
exports.destroy = function(req, res) {
  Member.findById(req.params.id, function (err, member) {
    if(err) { return handleError(res, err); }
    if(!member) { return res.send(404); }
    member.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
}; */

function handleError(res, err) {
  return res.send(500, err);
}
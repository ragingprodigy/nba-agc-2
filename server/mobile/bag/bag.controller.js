'use strict';

var _ = require('lodash'),
    User = require('../../api/user/user.model'),
    Bag = require('../../api/bag/bag.model');

// Get list of bags
exports.index = function(req, res) {
    Bag.find({ quantity: { "$gt": 0 }}).sort('_id').exec(function(err, bags){
        if (err) { return handleError(res, err); }
        return res.json(bags);
    });
};

exports.choose = function(req, res) {

    function chooseBag(user, bag) {
        user.bag = bag.name;
        user.save(function(err){
            // Decrement the bag count
            Bag.update({ name: bag.name }, { $inc: { quantity: -1 } }, function(err) {
                if (err) { return handleError(res, err); }
                return res.json(user);
            });
        });
    }

    User.findById(req.user, function(err, user){
        if (err) { return handleError(res, err); }

        Bag.findById(req.body.details._id, function(err, bag){
            if (err) { return handleError(res, err); }

            // If User doesn't have a bag selected, then go ahead
            if (user.bag === '') {
                return chooseBag(user, bag);
            } else if (user.bag === bag.name) {
                // Don't select the same bag twice
                return res.json(user);
            } else {
                // Decrement previous bag and set new one.
                Bag.update({ name: user.bag }, { $inc: { quantity: 1 } }, function(err) {
                    if (err) { return handleError(res, err); }
                    return chooseBag(user, bag);
                });
            }
        });
    });
};

function handleError(res, err) {
  return res.send(500, err);
}
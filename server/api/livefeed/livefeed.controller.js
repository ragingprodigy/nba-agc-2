/**
 * Created by radiumrasheed on 8/12/16.
 */

'use strict';

var _ = require('lodash'),
    LiveFeed = require('./livefeed.model');

// Get list of livefeed posts
exports.index = function (req, res) {
    LiveFeed.find(req.query)
        .sort('tweet_time')
        .exec(function (err, livefeed) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(livefeed);
        });
};

// Get last 10 livefeed posts in a session without comments
exports.sessionLiveFeed = function (req, res) {
    if (!req.query._session) {
        return handleError(res, err);
    }
    LiveFeed.find({_session: req.query._session}, '-comments')
        .populate()
        .sort('tweet_time')
        .limit(10)
        .exec(function (err, livefeed) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(livefeed);
        });
};

// Star a post
exports.likePost = function (req, res) {
    LiveFeed.update({_id: req.query.id}, {$inc: {star: 1}}, function (e) {
        if (e) {
            return handleError(res, err);
        }
        return res.status(200);
    });
};

// Get a single livefeed post
exports.show = function (req, res) {
    Livefeed.findById(req.params.id)
        .exec(function (err, livefeedPost) {
            if (err) {
                return handleError(res, err);
            }
            if (!session) {
                return res.send(404);
            }
            return res.json(livefeedPost);
        });
};

// Create a new post for live feed
exports.create = function (req, res) {
    LiveFeed.create(req.body, function (err, post) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(post);
    });
};


function handleError(res, err) {
    return res.send(500, err);
};
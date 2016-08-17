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
    //console.log(req.query);
    //console.log(req.params);
    LiveFeed.update({_id: req.params.id}, {$inc: {star: 1}}, function (e) {
        if (e) {
            return handleError(res, err);
        }
        LiveFeed.findById(req.params.id)
            .sort('tweet_time')
            .exec(function (err, livefeed) {
                if (err) {
                    return handleError(res, err);
                }
                //console.log(livefeed);
                return res.json(livefeed);
            });
    });
};

// Get a single livefeed post
exports.show = function (req, res) {

    LiveFeed.findById(req.query.id)
        .exec(function (err, livefeedPost) {
            if (err) {
                return handleError(res, err);
            }
            if (!livefeedPost) {
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

// Comment on a live feed
exports.addComment = function (req, res) {
    LiveFeed.find({_id: req.query.id}, function (err, post) {
        //console.log(req.params);
        //console.log(req.query);
        //console.log(req.body);
        if (err) {
            console.error('error');
            return handleError(res, err);
        }
        if (!post) {
            console.warn('not found');
            return res.send(404);
        }
        console.info('good');
        var comment = _.pick(req.body, ['email', 'fullname', 'content']);
        console.log(comment);
        comment.comment_date = new Date;


        post.comments.push(comment);
        post.save(function (err, newPost) {
            if (err) {
                return handleError(res, err);
            }
            console.log(newPost);
            return res.json(newPost);
        });
    });
};


function handleError(res, err) {
    return res.send(500, err);
};
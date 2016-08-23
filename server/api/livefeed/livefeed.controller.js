/**
 * Created by radiumrasheed on 8/12/16.
 */

'use strict';

var _ = require('lodash'),
    LiveFeed = require('./livefeed.model');

function getAFeed(id, res) {
    LiveFeed.findById(id)
        .populate('_session', 'title')
        .populate('_speaker', 'name')
        .exec(function (err, livefeed) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(livefeed);
        });
};

// Get list of livefeed posts
exports.index = function (req, res) {
    LiveFeed.find(req.query, '-comments')
        .populate('_session', 'title')
        .populate('_speaker', 'name')
        .sort('-tweet_time')
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
        .sort('-tweet_time')
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

    LiveFeed.update({_id: req.params.id}, {$inc: {star: 1}}, function (e) {
        if (e) {
            return handleError(res, err);
        }
        getAFeed(req.params.id, res);
        /*        LiveFeed.findById(req.params.id)
         .sort('-tweet_time')
         .populate('_session', 'title')
         .populate('_speaker', 'name')
         .exec(function (err, livefeed) {
         if (err) {
         return handleError(res, err);
         }
         return res.json(livefeed);
         });*/
    });
};

// Unstar a post
exports.unLikePost = function (req, res) {

    LiveFeed.update({_id: req.params.id}, {$inc: {star: -1}}, function (e) {
        if (e) {
            return handleError(res, err);
        }
        getAFeed(req.params.id, res);
        /*        LiveFeed.findById(req.params.id)
         .sort('-tweet_time')
         .populate('_session', 'title')
         .populate('_speaker', 'name').exec(function (err, livefeed) {
         if (err) {
         return handleError(res, err);
         }
         return res.json(livefeed);
         });*/
    });
};

// Get a single livefeed post
exports.show = function (req, res) {
    getAFeed(req.query.id, res);

    /*    LiveFeed.findById(req.query.id)
     .populate('_session', 'title')
     .populate('_speaker', 'name')
     .exec(function (err, livefeedPost) {
     if (err) {
     return handleError(res, err);
     }
     if (!livefeedPost) {
     return res.sendStatus(404);
     }
     return res.json(livefeedPost);
     });*/
};

// Create a new post for live feed
exports.create = function (req, res) {
    // Make sure post is no empty
    if (typeof req.body.tweet == "undefined" || req.body.tweet == '') {
        return res.status(406).json({message: 'Post cannot be empty!'})
    }

    LiveFeed.create(req.body, function (err, post) {
        if (err) {
            return handleError(res, err);
        }
        getAFeed(post._id, res);
        /*
         return res.json(post);
         */
    });
};

// Comment on a live feed
exports.addComment = function (req, res) {

    // Make sure comment is no tempty
    if (typeof req.body.content == "undefined" || req.body.content == '') {
        return res.status(406).json({message: 'Comment cannot be empty!'});
    }

    LiveFeed.findById(req.query.id, function (err, post) {

        if (err) {
            return handleError(res, err);
        }
        if (!post) {
            return res.send(404);
        }
        var comment = _.pick(req.body, ['email', 'fullname', 'content']);
        comment.comment_date = new Date;


        post.comments.push(comment);
        post.comment_count = post.comment_count + 1 //inc comment count
        post.save(function (err, newPost) {
            if (err) {
                return handleError(res, err);
            }
            getAFeed(newPost._id, res);
        });
    });
};


function handleError(res, err) {
    return res.status(500).send(err);
};
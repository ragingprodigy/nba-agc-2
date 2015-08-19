'use strict';

var _ = require('lodash');
var Session = require('./session.model'),
    Rating = require('./rating.model'),
    Attendee = require('./attendee.model'),
    Registration = require('../registration/registration.model'),
    moment = require('moment'),
    config = require('../../config/environment'),
    Agenda = require('agenda'),
    mailer = require('../../components/tools/mailer');

var agenda = new Agenda({db: { address: config.mongo.uri }});

var ObjectId = require('mongoose').Types.ObjectId;

function renderSession(session, res) {
    session.getRatings(function(err, ratings){
        session = session.toObject();
        session.ratings = ratings;
        return res.json(session);
    });
}

// Get list of sessions
exports.index = function(req, res) {
    if (req.query.me) {
        var fields = (req.query.lean?'title start_time end_time':'');
        Attendee.find({ user: new ObjectId(req.query.me) })
        .populate('session', fields)
        .exec(function(err, records){
            res.json(records);
        });
    } else {
        Session.find(req.query, 'title venue start_time end_time rating_start speakers', function (err, sessions) {
            if(err) { return handleError(res, err); }
            return res.json(sessions);
        });
    }
};

// Get a list of Conference Papers
exports.papers = function(req, res) {
    Session.find({})
    .populate({
        'path':'papers.speaker',
        'select':'name email title suffix _id'
    }).exec(function(err, sessions){
        var papers = _.flatten(_.pluck(_.filter(sessions, function(s){ return s.papers.length; }), 'papers'));
        res.json(papers);
    });
};

// Get a single session
exports.show = function(req, res) {
  var fields = (req.query.lean?'-photo_base64':'');

  Session.findById(req.params.id)
  .populate('speakers', fields)
  .populate({
      'path':'papers.speaker',
      'select':'name email title suffix _id'
  })
  .exec(function (err, session) {
    if(err) { return handleError(res, err); }
    if(!session) { return res.send(404); }
    return renderSession(session, res);
  });
};

// Ask a Question
exports.question = function(req, res) {
    Session.findById(req.params.id, function(err, session){
        if(err) { return handleError(res, err); }
        if(!session) { return res.send(404); }

        var duplicateQuestion = _.filter(session.questions, {question: req.body.question});

        if (duplicateQuestion.length) {
            return res.status(409).json({message:'This question has already been asked before!'});
        } else {
            var newQuestion = _.pick(req.body, ['question','name']);
            newQuestion.owner = req.user;

            session.questions.push(newQuestion);
            session.save(function(err) {
                if(err) { return handleError(res, err); }

                return res.json(session);
            });
        }
    });
};

exports.removeQuestion = function(req, res) {

    Session.findById(req.params.id).populate('speakers').exec(function(err, session){
        if(err) { return handleError(res, err); }
        if(!session) { return res.send(404); }

        // Check if the question is mine
        var isMine = _.find(session.questions, function(q){ return q._id.toString() == req.params.questionId && q.owner==req.user; });

        if (isMine) {
            session.questions = _.filter(session.questions, function(q){ return q._id.toString() !== req.params.questionId; });
            session.save(function(err) {
                if(err) { return handleError(res, err); }
                return renderSession(session, res);
            });
        } else {
            return res.status(403).json({message:'Access denied. You do not own this question.'});
        }
    });
};

// Add a rating for a conference session
exports.castVote = function(req, res) {
    // Find the Session
    Session.findById(req.params.id, function(err, session) {
        if(err) { return handleError(res, err); }
        if(!session) { return res.send(404); }

        // Voting Must be Open
        if (moment(session.rating_start).isBefore(new Date())) {

            // User must have registered for the Session
            Attendee.findOne({ user: new ObjectId(req.user) }, function(err, regDetail){
                if (!regDetail) {
                    return res.status(401).json({message: "You have not registered for this session. Please register before rating."});
                }

                // User must note have previously voted (single vote/rating per user)
                Rating.findOrCreate({ user: new ObjectId(req.user), session: new ObjectId(session._id) }, _.pick(req.body, ['comment', 'score']), function(err, userRating, created){
                    if (err) { return handleError(res, err); }

                    if (!created) { return res.status(409).json({message: 'You can only submit a rating once' }); }
                    else {
                        return res.status(201).json(userRating);
                    }
                })
            });
        } else {
            var voting_starts = moment(session.rating_start).calendar();
            return res.status(400).json({ message: 'Rating is not open yet. Rating starts: '+
            voting_starts });
        }
    });
};

// Register the current user for a Conference Session
exports.attendSession = function(req, res) {

    // Make sure the Session has not ended
    // Users can only register for Sessions whose Rating Period has not started
    Session.findById(req.params.id)
    .populate('speakers')
    .exec(function(err, session){
        if (err) {
            return handleError(res, err);
        }
        if (!session) {
            res.status(404).json({message: 'Session not found.'});
        }

        if (moment(session.end_time).isAfter(new Date())) {
            // Ensure a user cannot attend two sessions that start at the same time
            Attendee.find({user: new ObjectId(req.user)})
            .populate({
                path: 'session',
                select: 'title venue start_time'
            }).exec(function(err, sameTime){
                if (err) {return handleError(res, err); }

                var sameTimeSession = _.find(sameTime, function(a) { console.log(a.session.start_time,' == ', session.start_time); return moment(a.session.start_time).isSame(session.start_time); });

                if (sameTimeSession) {
                    return res.status(409).json({message: 'You\'ve registered for another session '+ sameTimeSession.session.title +' that starts at the same time as this one.' });
                } else {

                    Attendee.findOrCreate({
                        user: new ObjectId(req.user),
                        session: new ObjectId(req.params.id)
                    }, function (err, record, created) {
                        if (err) {
                            return handleError(res, err);
                        }

                        if (!created) {
                            return res.status(409).json({message: 'You can only register to attend once'});
                        }
                        else {
                            var alertDate = moment(session.start_time).subtract(2,'h');
                            agenda.schedule(alertDate, 'Send Mail and SMS Reminder', {session:session, userId:req.user});

                            return renderSession(session, res);
                        }
                    });
                }
            });
        } else {
            res.status(401).json({message: ' This Session ended: '+ moment(session.end_time).calendar() });
        }
    });
};

// UnRegister the current user for a Conference Session
exports.unAttendSession = function(req, res) {
    // Make sure the Session has not ended
    // Users can only un-register from Sessions whose Rating Period has not started
    Session.findById(req.params.id)
    .populate('speakers')
    .exec(function(err, session){
        if (err) { return handleError(res, err); }
        if (!session) { res.status(404).json({message: 'Session not found.'}); }

        if (moment(session.end_time).isAfter(new Date())) {
            Attendee.findOne({ user: new ObjectId(req.user), session: new ObjectId(req.params.id) }, function(err, record) {
                if (err) { return handleError(res, err); }
                if (!record) { return res.status(401).json({message: 'You have not registered to attend this session.' }); }

                record.remove(function(err){
                    if (err) { return handleError(res, err); }
                    return renderSession(session, res);
                });
            });
        } else {
            return res.status(400).json({message:'You can no longer un-register from this session because the session has ended.'});
        }
    });
};

// Creates a new session in the DB.
exports.create = function(req, res) {
  Session.create(req.body, function(err, session) {
    if(err) { return handleError(res, err); }
    return res.json(201, session);
  });
};

// Updates an existing session in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Session.findById(req.params.id, function (err, session) {
    if (err) { return handleError(res, err); }
    if(!session) { return res.send(404); }
    var updated = _.merge(session, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, session);
    });
  });
};

// Deletes a session from the DB.
exports.destroy = function(req, res) {
  Session.findById(req.params.id, function (err, session) {
    if(err) { return handleError(res, err); }
    if(!session) { return res.send(404); }
    session.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
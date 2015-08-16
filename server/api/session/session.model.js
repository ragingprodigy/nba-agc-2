'use strict';

var mongoose = require('mongoose'),
    Rating = require('./rating.model'),
    Schema = mongoose.Schema;

var SessionSchema = new Schema({
  title: String,
  description: String,
  venue: String,
  start_time: Date,
  end_time: Date,
  rating_start: Date,
  speakers : [{ type: Schema.Types.ObjectId, ref: 'Speaker' }],
  questions : [{
      question: {
          type: String,
          unique: true
      },
      name: String,
      owner: String
  }],
  papers : [{
      speaker: { type: Schema.Types.ObjectId, ref: 'Speaker' },
      title: String,
      document: String
  }]
});

// generating a hash
SessionSchema.methods.getRatings = function(done) {
    Rating.find({ session: this._id }, 'comment score user')
    .populate('user', 'email name')
    .exec(function(err, ratings){
        return done(err, ratings);
    });
};

module.exports = mongoose.model('Session', SessionSchema);
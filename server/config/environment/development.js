'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/nbaagc2-dev',
    //uri: 'mongodb://nba-agc:graceLIMITED12@c1126.candidate.19.mongolayer.com:11126,candidate.18.mongolayer.com:11252/nba-agc?replicaSet=set-55770081cd1daa7d940009df'
  },

  seedDB: true
};

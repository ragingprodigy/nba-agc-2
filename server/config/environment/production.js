'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP

    ip: process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080,

  // MongoDB connection options
  mongo: {
    uri:    process.env.MONGOLAB_URI ||
            process.env.MONGOHQ_URL ||
            process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||
    'mongodb://nba-agc:graceLIMITED12@candidate.18.mongolayer.com:11252,candidate.19.mongolayer.com:11126/nba-agc?replicaSet=set-55770081cd1daa7d940009df'
  }

};
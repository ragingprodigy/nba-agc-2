'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
    DOMAIN: 'http://localhost:9000',
    SESSION_SECRET: "nbaagc2-se78683*&^*hg3j5cret",
    // Control debug level for modules using visionmedia/debug
    DEBUG: '',
    WEB_CONCURRENCY: 1,
    SENDGRID_API_KEY: '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',

    SMS_OWNER_EMAIL: 'benedicta.moha@lawpavilion.com',
    SMS_SUB_ACCOUNT: 'NBA-AGC',
    SMS_SUB_ACCOUNT_PASSWORD: 'graceLIMITED12',
    SMS_SENDER: 'NBA-AGC 2016',
    SMS_MSG_TYPE: 0,

    CUTOFF: '2016-08-05 23:59'

    /*STORMPATH_API_KEY_ID: '6GVSYRJZ6I4M7XYT8X0UKIJFA',
    STORMPATH_API_KEY_SECRET: 'Yj+BTI3+YGITPI3aoRhBP6kuHOSJY1cVD17yiBbV1xM',
    STORMPATH_APP_HREF: 'https://api.stormpath.com/v1/applications/5fmXKTra2WYanXs9gTiIB9'*/
};

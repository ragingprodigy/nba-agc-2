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
    MANDRILL_API_KEY: '9UAR7iFKFPiZy9fGAJ0lLw',

    SMS_OWNER_EMAIL: '',
    SMS_SUB_ACCOUNT: '',
    SMS_SUB_ACCOUNT_PASSWORD: '',
    SMS_SENDER: 'NBA-AGC2015',
    SMS_MSG_TYPE: 0

    /*STORMPATH_API_KEY_ID: '6GVSYRJZ6I4M7XYT8X0UKIJFA',
    STORMPATH_API_KEY_SECRET: 'Yj+BTI3+YGITPI3aoRhBP6kuHOSJY1cVD17yiBbV1xM',
    STORMPATH_APP_HREF: 'https://api.stormpath.com/v1/applications/5fmXKTra2WYanXs9gTiIB9'*/
};

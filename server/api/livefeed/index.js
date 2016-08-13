/**
 * Created by radiumrasheed on 8/12/16.
 */

'use strict';

var express = require('express');
var controller = require('./livefeed.controller');
var sessionSec = require('../../components/tools/sessionSec');

var router = express.Router();

router.get('/', controller.index);  // get all liveFeed posts
router.get('/sessionLiveFeed', controller.sessionLiveFeed); // requires '_session' of session as query <ID of session>
router.get('/likePost', controller.likePost);   // requires 'id' of post as query

router.post('/addComment', controller.addComment);

router.get('/:id', controller.show);    // requires 'id' of post as query
router.post('/', controller.create); // create a live feed post

module.exports = router;
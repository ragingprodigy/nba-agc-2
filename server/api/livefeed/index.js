/**
 * Created by radiumrasheed on 8/12/16.
 */

'use strict';

var express = require('express');
var controller = require('./livefeed.controller');
var sessionSec = require('../../components/tools/sessionSec');

var router = express.Router();

router.get('/', controller.index);
router.get('/getLiveFeed', controller.show);    // requires 'id' of post as query
router.get('/likePost', controller.likePost);   // requires 'id' of post as query

router.post('/', controller.create);

module.exports = router;
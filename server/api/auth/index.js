'use strict';

var express = require('express');
var controller = require('./auth.controller');

var router = express.Router();

var sessionSec = require('../../components/tools/sessionSec');

router.post('/signup', controller.signUp);
router.post('/login', controller.signIn);
router.get('/me', sessionSec, controller.view);
router.put('/me', sessionSec, controller.update);

module.exports = router;
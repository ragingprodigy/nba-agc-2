'use strict';

var express = require('express');
var controller = require('./session.controller');
var sessionSec = require('../../components/tools/sessionSec');

var router = express.Router();

router.get('/', controller.index);
router.get('/papers', controller.papers);
router.get('/:id', controller.show);

router.post('/:id/question', controller.question);
router.delete('/:id/question/:questionId', controller.removeQuestion);

router.post('/:id/attend', controller.attendSession);
router.post('/:id/unAttend', controller.unAttendSession);
router.post('/:id/vote', sessionSec, controller.castVote);

module.exports = router;
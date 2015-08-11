'use strict';

var express = require('express');
var controller = require('./session.controller');
var sessionSec = require('../../components/tools/sessionSec');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);

//router.post('/', controller.create);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);

router.post('/:id/attend', sessionSec, controller.attendSession);
router.post('/:id/unAttend', sessionSec, controller.unAttendSession);
router.post('/:id/vote', sessionSec, controller.castVote);

module.exports = router;
'use strict';

var express = require('express');
var controller = require('./speaker.controller');
var sessionSec = require('../../components/tools/sessionSec');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);

module.exports = router;
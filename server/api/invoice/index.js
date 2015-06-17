'use strict';

var express = require('express');
var controller = require('./invoice.controller');
var sessionSec = require('../../components/tools/sessionSec');

var router = express.Router();

router.get('/', sessionSec, controller.index);
router.get('/:id', sessionSec, controller.show);
router.post('/', sessionSec, controller.create);
router.put('/:id', sessionSec, controller.update);
router.patch('/:id', sessionSec, controller.update);
router.delete('/:id', sessionSec, controller.destroy);

module.exports = router;
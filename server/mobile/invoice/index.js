'use strict';

var express = require('express');
var controller = require('./invoice.controller');
var sessionSec = require('../../components/tools/sessionSec');

var router = express.Router();

router.post('/', controller.create);
router.post('/delete', controller.destroy);
//router.get('/', sessionSec, controller.index);
router.get('/:id', sessionSec, controller.show);
router.put('/:id', sessionSec, controller.update);
router.patch('/:id', sessionSec, controller.update);


module.exports = router;
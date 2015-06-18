'use strict';

var express = require('express');
var controller = require('./registration.controller');

var sessionSec = require('../../components/tools/sessionSec');

var router = express.Router();

router.get('/me', sessionSec, controller.fetch);
router.post('/webPayStatus', sessionSec, controller.webPayStatus);
router.get('/', sessionSec, controller.index);

router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);

router.post('/:id', sessionSec, controller.clone);

router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

router.post('/postPay', controller.postPay);

module.exports = router;
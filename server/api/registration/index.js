'use strict';

var express = require('express');
var controller = require('./registration.controller');

var sessionSec = require('../../components/tools/sessionSec');

var router = express.Router();

router.post('/otherCode', controller.otherCode);
router.post('/onebranch', controller.oneBranch);
router.post('/saveOrder', controller.saveOrderBranch);
router.post('/saveVipCode', controller.saveVipCode);
router.get('/branch', controller.branch);
router.get('/gencode', controller.genCode);
router.get('/me', sessionSec, controller.fetch);
router.post('/postPay', controller.postPay);
router.post('/webPayStatus', sessionSec, controller.webPayStatus);

router.get('/', sessionSec, controller.index);
router.get('/attendees', controller.attendees);

router.get('/:id', controller.show);

router.post('/', controller.create);
router.put('/:id', controller.update);

router.post('/:id', sessionSec, controller.clone);

router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
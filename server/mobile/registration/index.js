'use strict';

var express = require('express');
var controller = require('./registration.controller');

var sessionSec = require('../../components/tools/sessionSec');

var router = express.Router();

router.post('/deleteGroupReg', controller.destroy);
router.post('/groupDetails', controller.groupUsers);
router.post('/otherCode', controller.otherCode);
router.post('/onebranch', controller.oneBranch);
router.post('/saveOrder', controller.saveOrderBranch);
router.post('/saveVipCode', controller.saveVipCode);
router.get('/branch', controller.branch);
router.get('/me', sessionSec, controller.fetch);
router.post('/postPay', controller.postPay);
router.post('/webPayStatus', sessionSec, controller.webPayStatus);

router.get('/attendees', controller.attendees);

router.get('/:id', controller.show);

router.post('/', controller.create);
router.put('/:id', controller.update);

router.post('/:id', sessionSec, controller.clone);

router.patch('/:id', controller.update);


module.exports = router;
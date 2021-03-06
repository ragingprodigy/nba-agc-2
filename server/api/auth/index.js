'use strict';

var express = require('express');
var controller = require('./auth.controller');

var router = express.Router();

var sessionSec = require('../../components/tools/sessionSec');

//router.get('/calculus_prime', controller.oneTimeTask);

router.post('/signup', controller.signUp);
router.post('/login', controller.signIn);
router.post('/recoverPassword', controller.recovery);
router.post('/confirmResetRequest', controller.confirmReset);
router.post('/changePassword', controller.changePassword);

router.get('/', sessionSec, controller.view);
router.get('/qrCode', controller.qrCode);
router.put('/', sessionSec, controller.update);

module.exports = router;
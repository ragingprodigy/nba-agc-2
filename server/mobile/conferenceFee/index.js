'use strict';

var express = require('express');
var controller = require('./conferenceFee.controller');

var router = express.Router();

//router.get('/calculus_prime', controller.oneTimeTask);

router.post('/', controller.getFee);

module.exports = router;
'use strict';

var express = require('express');
var controller = require('./member.controller');

var router = express.Router();

/*router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);*/

// Only allow member details to be verified
router.post('/verify', controller.verify);
router.post('/getMember', controller.getMember);
router.post('/savemember', controller.create);

module.exports = router;
'use strict';

var express = require('express');
var controller = require('./speaker.controller');
var sessionSec = require('../../components/tools/sessionSec');

var router = express.Router();

router.get('/', sessionSec, controller.index);
router.get('/:id', sessionSec, controller.show);

/*router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);*/
//router.delete('/:id', controller.destroy);

module.exports = router;
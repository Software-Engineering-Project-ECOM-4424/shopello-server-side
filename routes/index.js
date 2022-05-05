'use strict';
var express = require('express');
var router = express.Router();
const auth = require('./Auth');
const products = require('./Product');

router.use('/auth', auth);
router.use('/products', products);

module.exports = router;

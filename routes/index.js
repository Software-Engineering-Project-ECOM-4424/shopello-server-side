'use strict';
var express = require('express');
var router = express.Router();
const auth = require('./Auth');
const products = require('./Product');
const homePage = require('./HomePage');
const categories = require('./Categories');

router.use('/auth', auth);
router.use('/products', products);
router.use('/homepage',homePage);
router.use('/categories',categories);

module.exports = router;

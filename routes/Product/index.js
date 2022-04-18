'use strict';
const router = require('express').Router();
const dbContext = require('../../database/connection')
const { body, validationResult } = require('express-validator');

router.get('/');
router.post('/');
router.get('/:id');
router.put('/');
router.delete('/:id');


module.exports = router
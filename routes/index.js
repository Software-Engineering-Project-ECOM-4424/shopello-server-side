'use strict';
var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('./Auth')

router.use('/auth', auth)

router.post('/test',
  body('username').isEmail().normalizeEmail(),
  body('text').notEmpty(),
  function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()})
    }
    res.json('success   asdf🔥🔥');
  });


module.exports = router;

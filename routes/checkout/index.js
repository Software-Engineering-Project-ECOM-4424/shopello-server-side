'use strict';
const router = require('express').Router();
const dbContext = require('../../database/connection')
const { body, validationResult } = require('express-validator');
const checkAdmin = require('../../middlewares/check-admin');
const checkSignIn = require('../../middlewares/check-sign-in');



// router.post('/',
//     checkSignIn,
//     async (req, res) => {
//         const {product_id, }
//     }

// );



module.exports = router
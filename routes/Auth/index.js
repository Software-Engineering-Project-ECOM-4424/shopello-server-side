'use strict';
const router = require('express').Router();
const dbContext = require('../../database/connection')
const { body, validationResult } = require('express-validator');


router.post(
    'login',
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        dbContext.query('select password from users where email = $1', [email])
            .then(result => {
                if (result.rows[0] == password) {
                    return res.status(200).json({ "token": "token" });
                } else {
                    return res.status(401).json("bad credentials")
                }
            })
            .catch(err => {
                return res.status(500).json("SERVER 500 SORRY!!")
            })
    });




router.post(
    '/testdb',

    body('username').isLength({ min: 3 }),


    body('email').isEmail(),
    
    body('password').isStrongPassword({ minLength: 8, minNumbers: 1, minSymbols: 1, minUppercase: 1, minLowercase: 1 }),
    
    async (req, res, next) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const { username, email, password } = req.body ;
        const { rows } = await dbContext.query('SELECT username, email FROM users WHERE email = $1', [email])
        if (rows.length > 0) {
            res.status(409).json({ "errors": "existed user" });
        }
        dbContext.query('INSERT INTO users (role, username, email, password) values ($1, $2, $3, $4) RETURNING *',
            ["Customer", username, email, password])
            .then(result => {
                res.status(201).json(result.rows[0])
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err)
            });
    });




module.exports = router;

'use strict';
const router = require('express').Router();
const dbContext = require('../../database/connection');
const { comparePasswords, hashPassword } = require('../../utils/b-crypt')
const { body, validationResult } = require('express-validator');
const { signToken, verifyToken } = require('../../utils/jwt');
const checkSignIn = require('../../middlewares/check-sign-in');


router.post('/signup',
    body('username').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isStrongPassword({ minLength: 8, minNumbers: 1, minSymbols: 1, minUppercase: 1, minLowercase: 1 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        try {
            const { username, email, password } = req.body;
            const { rows } = await dbContext.query('SELECT username, email FROM users WHERE email = $1', [email])
            if (rows.length > 0) {
                return res.status(409).json({ "errors": "existed user" });
            }
            const pwd = await hashPassword(password);
            const result = await dbContext.query('INSERT INTO users (role, username, email, password) values ($1, $2, $3, $4) RETURNING *',
                ["Customer", username, email, pwd]);
            return res.status(201).json(result.rows[0])
        } catch (err) {
            return res.status(500).json(err)
        }
    }
);


router.post('/login',
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        try {
            const { rows } = await dbContext.query('SELECT id,password FROM users WHERE email = $1', [email])
            const compared = await comparePasswords(password, rows[0].password);
            if (compared) {
                const { SECRET_KEY } = process.env;
                const userId = rows[0].id;
                const token = await signToken(userId + "", SECRET_KEY);
                return res.status(200).json({ token: token,userId:userId });
            } else {
                return res.status(401).json({ message: "bad credentials" });
            }
        } catch (err) {
            return res.status(401).json(err);
        }
    }
);



router.post('/adminlogin',
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        try {
            const { rows } = await dbContext.query('SELECT id, role, password, username, email FROM users WHERE email = $1', [email]);
            if (rows[0].role !== "Admin") {
                return res.status(401).json({ message: "u r not authorozied" });
            }
            const compared = await comparePasswords(password, rows[0].password);
            if (compared) {
                const { SECRET_KEY } = process.env;
                const userId = rows[0].id;
                const token = await signToken(userId + "", SECRET_KEY);
                return res.status(200).json({ token: token, remember: req.body?.remember, name: rows[0].username, email: rows[0].email });
            } else {
                return res.status(401).json({ message: "bad credentials" });
            }
        } catch (err) {
            return res.status(401).json(err);
        }
    }
);


router.get('/user',
    checkSignIn,
    async (req, res) => {
        try {
            const { rows } = await dbContext.query('SELECT id,username,email FROM users WHERE id = $1', [req.body.userId])
            if (rows.length > 0) {
                return res.status(200).json(rows[0]);
            }
            else return res.status(500).json({ message: "No User" });
        } catch (error) {
            // throw error
            return res.status(500).json(error);
        }
    });



module.exports = router;

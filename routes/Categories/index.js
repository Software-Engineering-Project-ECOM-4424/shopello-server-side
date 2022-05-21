'use strict';
const router = require('express').Router();
const dbContext = require('../../database/connection')
const { body, validationResult } = require('express-validator');
const checkAdmin = require('../../middlewares/check-admin');

router.get('/',
    // checkAdmin,
    async (req, res) => {
        try {
            const { rows } = await dbContext.query('SELECT * FROM categories');
            return res.status(200).json(rows);
        } catch (error) {
            res.status(500).json(error);
        }
    }
);


router.post('/',
    checkAdmin,
    body('name').isLength({ min: 3 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        try {
            const { name } = req.body;
            const result = await dbContext.query('INSERT INTO categories(name) VALUES ($1) RETURNING *;'
                , [name]);
            res.status(201).json(result.rows[0]);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
);

router.get('/:id',
    async (req, res) => {
        const id = req.params.id;
        try {

            const { rows } = await dbContext.query('SELECT * FROM categories WHERE id = $1', [id]);
            return res.status(200).json(rows[0]);
        } catch (error) {
            res.status(500).json(error);
        }
    });

router.put('/:id',
    checkAdmin,
    body('name').isLength({ min: 3 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        try {
            const id = req.params.id;
            const { name } = req.body;
            const result = await dbContext.query('UPDATE categories SET name=$1  WHERE id = $2 RETURNING *;'
                , [name, id]);
            if (result.rows.length < 1) {
                return res.status(404).json();
            }
            return res.status(200).json(result.rows[0]);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
);
router.delete('/:id',
    checkAdmin,
    async (req, res) => {
        try {
            const id = req.params.id;
            const result = await dbContext.query('delete from categories WHERE id = $1 RETURNING *', [id])
            return res.status(200).json(result.rows[0]);
        } catch (error) {
            return res.status(500).json(error)
        }
    }
);


module.exports = router
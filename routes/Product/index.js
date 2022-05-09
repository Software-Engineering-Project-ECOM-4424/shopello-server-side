'use strict';
const router = require('express').Router();
const dbContext = require('../../database/connection')
const { body, validationResult } = require('express-validator');
const checkAdmin = require('../../middlewares/check-admin');
const multer = require('multer');
const path = require("path");

const storage = multer.diskStorage({
    destination: "./images",
    filename: function (req, file, cb) {
        cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 },
}).single("image");



router.get('/',
    async (req, res) => {
        try {
            const { rows } = await dbContext.query('SELECT * FROM products');
            return res.status(200).json(rows);
        } catch (error) {
            res.status(500).json(error);
        }
    }
);


router.post('/',
    // checkAdmin,
    upload,
    body('name').isLength({ min: 3 }),
    body('description').isLength({ min: 3 }),
    body('price').isFloat(),
    body('category_id').isInt(),
    async (req, res) => {
        if (!req.file) {
            return res.sendStatus(422);
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        try {
            const { name, description, price, category_id } = req.body;
            const result = await dbContext.query('INSERT INTO products(name, description, price, category_id, image, status) VALUES ($1, $2, $3, $4, $5, TRUE) RETURNING *;'
                , [name, description, price, category_id, req.file.filename]);
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

            const { rows } = await dbContext.query('SELECT * FROM products WHERE id = $1', [id]);
            return res.status(200).json(rows[0]);
        } catch (error) {
            res.status(500).json(error);
        }
    });
router.put('/:id',
    body('name').isLength({ min: 3 }),
    body('description').isLength({ min: 3 }),
    body('price').isFloat(),
    body('category_id').isInt(),
    async (req, res) => {
        if (!req.file) {
            return res.sendStatus(422);
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        try {
            const id = req.params.id;
            const { name, description, price, category_id } = req.body;
            const result = await dbContext.query('UPDATE products SET name=$1, description=$2, price=$3, category_id=$4, image=$5 WHERE id = $6 RETURNING *;'
                , [name, description, price, category_id, req.file.filename, id]);
            res.status(201).json(result.rows[0]);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
);
router.delete('/:id',
    async (req,res) => {
        try {
            const id = req.params.id;
            const result = await dbContext.query('UPDATE products SET status=FALSE WHERE id = $1 RETURNING *',[id])
            return res.status(200).json(result.rows[0]);

        } catch (error) {
            return res.status(500).json(error)
        }
    }
);


module.exports = router
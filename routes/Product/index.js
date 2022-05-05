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
            const result = await dbContext.query('INSERT INTO products(name, description, price, category_id, image) VALUES ($1, $2, $3, $4, $5) RETURNING *;'
                , [name, description, price, category_id, req.file.filename]);
            res.status(201).json(result.rows[0]);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
);

router.get('/:id');
router.put('/');
router.delete('/:id');


module.exports = router
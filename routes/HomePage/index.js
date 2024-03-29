'use strict';
const router = require('express').Router();
const dbContext = require('../../database/connection')
const { body, validationResult } = require('express-validator');
const checkAdmin = require('../../middlewares/check-admin');
const multer = require('multer');
const path = require("path");


router.get('/products',
    async (req, res) => {
        try {
            const { rows } = await dbContext.query('SELECT products.id,products.name as productName,products.description,products.price, products.image, products.category_id,categories.name as categoryName FROM products inner join categories on products.category_id = categories.id where products.status=false')
            if (rows.length > 0) {
                return res.status(200).json(rows);
            }
            else return res.status(500).json({ message: "No Producte" });
        } catch (error) {
            // throw error
            return res.status(500).json(error);
        }
    });

router.get('/products/category',
    async (req, res) => {
        try {
            console.log(req.query.category_name)
            const { rows } = await dbContext.query('SELECT products.id,products.name as productName,products.description,products.price, products.image, products.category_id,categories.name as categoryName FROM products inner join categories on products.category_id = categories.id where categories.name = $1 and products.status=false', [req.query.category_name])
            if (rows.length > 0) {
                return res.status(200).json(rows);
            }
            else return res.status(500).json({ message: "No Producte In Requested Category" });
        } catch (error) {
            // throw error
            return res.status(500).json(error);
        }
    });

router.get('/product-details',
    async (req, res) => {
        try {
            const { rows } = await dbContext.query('SELECT id,name,description,price, image, category_id FROM products WHERE id = $1', [req.query.product_id])
            if (rows.length > 0) {
                return res.status(200).json(rows);
            }
            else return res.status(500).json({ message: "Category Unavailable" });
        } catch (error) {
            // throw error
            return res.status(500).json(error);
        }
    });

router.get('/category-list',
    async (req, res) => {
        try {
            const { rows } = await dbContext.query('SELECT name FROM  categories')
            if (rows.length > 0) {
                return res.status(200).json(rows);
            }
            else return res.status(500).json({ message: "Product Unavailable" });
        } catch (error) {
            // throw error
            return res.status(500).json(error);
        }
    });

router.get('/search',
    async (req, res) => {
        try {
            const { rows } = await dbContext.query(`SELECT products.id,products.name as productName,products.description,products.price, products.image, products.category_id,categories.name as categoryName FROM products inner join categories on products.category_id = categories.id WHERE products.name LIKE '%${req.query.query}%' and products.status = false`)
            if (rows.length > 0) {
                return res.status(200).json(rows);
            }
            else return res.status(500).json({ message: "No Producte" });
        } catch (error) {
            // throw error
            return res.status(500).json(error);
        }
    }
)

module.exports = router
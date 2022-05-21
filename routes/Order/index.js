'use strict';
const router = require('express').Router();
const dbContext = require('../../database/connection')
const { body, validationResult } = require('express-validator');
const checkAdmin = require('../../middlewares/check-admin');
const checkSignIn = require('../../middlewares/check-sign-in');



router.post('/',
    checkSignIn,
    async (req, res) => {
        //amount must be done in server side
        const { products, amount } = req.body;
        const userId = req.body.userId;

        try {
            let { rows } = await dbContext.query('INSERT INTO orders(amount, user_id, status) values ($1, $2, $3) RETURNING *', [amount, req.body.userId, false]);
            // const order = rows[0];
            for (let i = 0; i < products.length; i++) {
                await dbContext.query('INSERT INTO order_details(product_id, quantity, order_id) values ($1, $2, $3)', [products[i].id, products[i].quantity, rows[0].id])
                console.log(rows[0])
            }
            return res.json(rows[0]);
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }

    }

);


router.get('/',
    async (req, res) => {
        try {
            const { rows } = await dbContext.query('SELECT * , orders.id as orderID FROM orders inner join users on orders.user_id = users.id where status = false');
            return res.json(rows);
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }

    }
);router.get('/order-details/:id',
    async (req, res) => {
        const id = req.params.id;
        try {
            const { rows } = await dbContext.query('SELECT order_details.id, order_details.product_id, order_details.quantity, order_details.order_id, products.name FROM order_details JOIN products ON order_details.product_id = products.id WHERE order_details.order_id = $1',id);
            return res.json(rows);
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }

    }
);


router.put('/:id',
    async (req, res) => {
        try {
            const { rows } = await dbContext.query('UPDATE orders set status=true where id =$1',[req.params.id]);
            return res.json("updated");
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }
);



module.exports = router
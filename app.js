'use strict';
const express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const routes = require('./routes/index');
const bodyParser = require('body-parser');
require('dotenv').config();
const dbContext = require('./database/connection')




var app = express();

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.disable('x-powered-by');

/* made for supertest . */
app.get('/test', function (req, res, next) {
    res.status(200).json('success 🔥🔥');
});



app.use('/api/v1', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error 
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json(err.message)
});

app.set('port', process.env.PORT || 3000);


module.exports = app;

const express = require('express');
const path = require('path');
const logger = require('morgan');
const session = require('express-session');

// initialize database
require('./models');

// import routers
var indexRouter = require('./routes/index');
var advertRouter = require('./routes/advert');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'keyboard cat'
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/advert', advertRouter);

module.exports = app;

require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const passport = require('passport');
  // LocalStrategy = require('passport-local').Strategy;
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const urlParser = bodyParser.urlencoded({extended: false});
const jsonParser = bodyParser.json();
const request = require('request');
const news = require('./apis/newsController');

//DO NOT REMOVE THE BELOW FUNCTION ... WE MAY NEED TO RUN IT AT SOME POINT IN THE FUTURE!!
//news.newsApiImport();

  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, '../client')));

  app.use(session({
    secret: 'corgisaregreat',
    resave: true,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  require('./routes.js')(app, express, passport);
  require('./authRoutes.js')(app, passport);


var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log("Readcastly server listening intently on port: ", port);
});


module.exports = app;

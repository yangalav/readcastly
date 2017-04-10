require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
// const passport = require('passport'),
  // LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const urlParser = bodyParser.urlencoded({extended: false});
const jsonParser = bodyParser.json();
const request = require('request');
const news = require('./apis/newsController');

//DO NOT REMOVE THE BELOW FUNCTION ... WE MAY NEED TO RUN IT AT SOME POINT IN THE FUTURE!!
//news.newsApiImport();


  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, '../client')));

  // app.use(passport.initialize());
  // app.use(passport.session());




//
// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));

var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log("Readcastly server listening intently on port: ", port);
});

require('./routes.js')(app, express);

module.exports = app;

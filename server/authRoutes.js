require('dotenv').config();
const LocalStrategy = require('passport-local').Strategy;
const User = require('./database/controllers/usersController');
const db = require('./database/dbConfig');

module.exports = function(app, passport) {

//----SIGN-UP ROUTE----
passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },

  function(req, email, password, done) {
    console.log(req)

      console.log('Local signup strategy working');
      User.findByEmail(email).then(function(user) {
        if(user.length) {
          console.log('user exists, it is ' + user[0].first_name);
          return done(null, false, { message: 'Incorrect username.' });
        } else {
          User.addUser(email,password,req.body.firstName,req.body.lastName,req.body.phone,req.body.voicePref,req.body.avatar);
          console.log('user added!');
          return done(null, req.body.email);
        }
      });
  }));

// ----LOGIN ROUTE----
passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    console.log('Local login strategy working');
    User.findByEmail(email).then(function(user) {
      if(!user.length) {
        console.log('Email not found');
        return done(null, false, { message: 'Email already taken'});
      } else {
        console.log('hahahahahahaha');
        return done(null, false, { message: 'Email'});
      }
    })
  }));

//---SERIALIZING USER----
  passport.serializeUser(function(email, done) {
    return done(null, email);
  });

  passport.deserializeUser(function(email, done) {
    // User.findByEmail(email).then(function(err, user) {
    //   return done(err, user);
    // });
  })
}

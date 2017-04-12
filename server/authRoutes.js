require('dotenv').config();
// const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./database/controllers/usersController');
const db = require('./database/dbConfig');


let LocalSignup =  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },

  function(req, email, password, done) {
    process.nextTick(function() {
      console.log('Local strategy working');

      // User.findByEmail(email).then(function(user) {
      //   if(user !== '') {
      //     console.log('User exists, its ' + user);
      //   } else {
      //      User.addUser(email,password).then(function(){
      //          console.log('User added');
      //      });
      //   };
      // });

      User.findByEmail(email).then(function(user) {
        if(user.length) {
          console.log('user exists, it is ' + user[0].first_name);
        } else {
          User.addUser(email,password,req.body.firstName,req.body.lastName,req.body.phone,req.body.voicePref,req.body.avatar);
          console.log('user added!');
        }
      });

    });
  });


module.exports = function(app, passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.getByID(id, function(err, user) {
      done(err, user);
    });
  })

  passport.use('local-signup', LocalSignup);

  // app.post('/signup',
  //   passport.authenticate('local', { successRedirect: '/',
  //                                    failureRedirect: '/login',
  //                                    failureFlash: true })
  // );
}

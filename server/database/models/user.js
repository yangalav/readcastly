var db = require('../dbConfig');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var currentUser = 0;

var Model = db.Model.extend({

  tableName: 'Users',
  hasTimestamps: false,
  initialize: function() {
    this.on('creating', this.hashPassword);
  },
  comparePassword: function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
      currentUser = this.get('id');
      callback(isMatch);
    });
  },
  hashPassword: function() {
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.get('password'), null, null).bind(this)
      .then(function(hash) {
        this.set('password', hash);
      });
  }
  });

module.exports = {
  Model: Model,
  currentUser: currentUser
}

// Note to self: Model files are a bookshelf feature to allow us to attach libraries of common tasks used when querying databases
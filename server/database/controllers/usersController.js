const db = require('../dbConfig');
const Users = require('../collections/users');
const User = require('../models/user');

const getByID = function(userId,callback) {
  console.log('get by ID ', userId);
  return db.knex('Users')
    .where({ userId: userId })
    .select('*')
    .then(callback);
};

const findByEmail = function(email) {
  console.log('find one by email', email);
  return db.knex('Users')
    .where({ email: email })
    .then(function(email) {
      console.log(email)
      return email;
    })
    .catch(function(err) {
      console.error(err)
    });
};


const addUser = function(email,password) {
  console.log('adding ' + email + ' and ' + password);
  return db.knex('Users')
    .insert(
    {
      email: email,
      password: password
    }
  )
  .catch(function(err) {
    console.error(err)
  });
  // .then(callback);
  // .catch(function(err) {
  //   console.error(err)
  // });
  console.log('added user! ' + email);
};

module.exports= {
  getByID,
  findByEmail,
  addUser
};

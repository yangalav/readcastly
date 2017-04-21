const db = require('../dbConfig');
const Users = require('../collections/users');
const User = require('../models/user');

const findById = function(id) {
  console.log('find by ID ', id);
  return db.knex('Users')
    .where({ id: id })
    .then(function(user){
      console.log('this thaaaa user:')
      console.log(user[0])
      return user[0];
    })
    .catch(function(err){
      console.error(err)
    });
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

const checkEmail = function(email,callback) {
  return findByEmail(email)
    .then((result) => {
      return (result.length === 0) ? callback({found: false}) : callback({found: true});
    })
    .catch((err) => console.log('email checking error ==== ', err));
}

const addUser = function(email,password,firstName,lastName,phone,voicePref,avatar) {
  console.log('adding ' + email + ' and ' + password);
  return db.knex('Users')
    .insert(
    {
      email: email,
      password: password,
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      voice_pref: voicePref,
      avatar: avatar,
    }
  )
  .then(function() {
    const user = db.knex('Users').where({ email: email });
    return user;
  })
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
  findById,
  findByEmail,
  addUser,
  checkEmail
};

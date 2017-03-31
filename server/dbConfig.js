require('dotenv').config()

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'mysqlcluster18.registeredsite.com',
    user : 'readcastlyadmin',
    password : process.env.DATABASE_PASSWORD,
    database : 'readcastly'
  }
});

var db = require('bookshelf')(knex);

module.exports = db;


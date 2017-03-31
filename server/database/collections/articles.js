var db = require('../dbConfig');
var Article = require('../models/article');

var Articles = new db.Collection();

Articles.model = Article;

module.exports = Articles;
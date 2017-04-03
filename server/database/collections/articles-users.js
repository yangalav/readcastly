var db = require('../dbConfig');
var ArticleUser = require('../models/article-user');

var ArticlesUsers = new db.Collection();

ArticlesUsers.model = ArticleUser;

module.exports = ArticlesUsers;
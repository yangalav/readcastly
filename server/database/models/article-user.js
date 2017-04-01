var db = require('../dbConfig');

var ArticleUser = db.Model.extend({
  tableName: 'Articles-Users'
});

module.exports = ArticleUser;

// Note to self: Model files are a bookshelf feature to allow us to attach libraries of common tasks used when querying databases


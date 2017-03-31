var db = require('../dbConfig');

var Article = db.Model.extend({
  tableName: 'Articles'
});

module.exports = Article;

// Note to self: Model files are a bookshelf feature to allow us to attach libraries of common tasks used when querying databases


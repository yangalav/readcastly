var db = require('../dbConfig');

var Article = db.Model.extend({
  tableName: 'Articles',
  hasTimestamps: true,

  addedToLibrary: function() {
    this.set('likes', this.get('likes') + 1);
  },

  converted: function() {
    this.set('converted', this.get('converted') + 1);
  }

});

module.exports = Article;

// Note to self: Model files are a bookshelf feature to allow us to attach libraries of common tasks used when querying databases


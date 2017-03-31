var db = require('../dbConfig');

var Source = db.Model.extend({
  tableName: 'Sources'
})

module.exports = Source;

// Note to self: Model files are a bookshelf feature to allow us to attach libraries of common tasks used when querying databases
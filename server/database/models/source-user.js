var db = require('../dbConfig');

var SourceUser = db.Model.extend({
  tableName: 'Sources-Users'
});

module.exports = SourceUser;

// Note to self: Model files are a bookshelf feature to allow us to attach libraries of common tasks used when querying databases


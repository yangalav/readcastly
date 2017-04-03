var db = require('../dbConfig');
var SourceUser = require('../models/source-user');

var SourcesUsers = new db.Collection();

SourcesUsers.model = SourceUser;

module.exports = SourcesUsers;
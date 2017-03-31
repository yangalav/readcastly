var db = require('../dbConfig');
var Source = require('../models/source');

var Sources = new db.Collection();

Sources.model = Source;

module.exports = Sources;
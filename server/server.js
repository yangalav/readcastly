require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const urlParser = bodyParser.urlencoded({extended: false});
const jsonParser = bodyParser.json();
// const request = require('request'); we shouldn't need this, as request now in routes (tested and works)
const news = require('./apis/newsController');

//DO NOT REMOVE THE BELOW FUNCTION ... WE MAY NEED TO RUN IT AT SOME POINT IN THE FUTURE!!
//news.newsApiImport();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../client')));

var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log("Readcastly server listening intently on port: ", port);
});

require('./routes.js')(app, express);

module.exports = app;

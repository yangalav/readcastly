require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const urlParser = bodyParser.urlencoded({extended: false});
const jsonParser = bodyParser.json();
const request = require('request');

const Articles = require('./database/controllers/articlesController');
const Sources = require('./database/controllers/sourcesController');
const Users = require('./database/controllers/usersController');
const User = require('./database/models/user');
const utils = require('./utils.js');

//DO NOT REMOVE THE BELOW FUNCTION ... WE MAY NEED TO RUN IT AT SOME POINT IN THE FUTURE!!
//utils.newsApiImport();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../client')));

// app.post('/requrl/:requrl', function(req, res) {
//   console.log('server.js, POST to /requrl/:requrl. l. 15: req received.');
//   let requrl = req.params.requrl;
//   console.log('server.js POST to requrl. l. 14. req.params.url = ', req.params.requrl);

// receive POST req of URL user wants to hear; send GET req to Mercury & receive obj w/ parsed data; send to articlesController.js; (will refactor to pull out routes at least)
app.post('/requrl', function(req, res) {
  console.log('server.js, POST to /requrl. l. 20: req received. body = ', req.body);
  let requrl = req.body.requrl;
  console.log('server.js POST to requrl. l. 14. requrl = ', requrl);

  var objToSaveToDB = {
    url: requrl,
    user_id: User.currentUser || 99
  };

  var options = {
    method: 'GET',
    url: 'https://mercury.postlight.com/parser?url=' + requrl,
    headers: {
      'x-api-key': process.env.PARSER_KEY,
      'content-type': 'application/json'
      }
  };

  request(options, function (error, response, body) {
    if (error) {console.log('server.js, GET req to Mercury. error! = ', error);
      res.status(400).send('Dang; error retrieving parsed text of url from Mercury...');
    }
    var parsedBody = JSON.parse(body);
    if (parsedBody.error) {
      res.send(utils.errors.badUrl);
    } else {
      objToSaveToDB = utils.objBuilder(objToSaveToDB,parsedBody);
      Articles.create(objToSaveToDB,function(result){
        res.send(result);
      });
    }
  });
});

// tested this route with an array of all articles currently in db and it worked; sample article below @ testdb
app.get('/getAll', function(req, res) {
  // console.log('received GET request to /. Here is test db array: ');
  // console.log('server.js received GET req at / . Readcastly is on its way to fame & fortune!');
  // res.send('We heard your GET req and the diligent Readcastly hamsters are fast at work. All your wildest dreams will soon come true. Stay tuned for more exciting endpoints coming soon to a Postman near you.');
  // res.send(testdb);

  // temporarily sending full db to req to this endpoint, as test to render on FE:
  console.log('server.js received GET req at / . This obj is contents of Readcastly db!');
  // var TESTobjToSaveToDB = {url: 'www.testingResToGETwithGetAll.com'};
  // Articles.create(null, function(library){

  // call getAll w/ user 99 & cb = res.send
  Articles.getAll(/*User.currentUser*/99, function(library) {
    res.send(library);
  });
});

// to test urlParser; will update to add authentication route when we get to that story
// app.post('/login', urlParser, function(req, res) {
//   console.log('server.js l. 16: received POST to /login. Will read it now...');
//   if(req.body === {}) {
//     console.log('server.js l. 18 - urlParser says body is empty on this request: ', req);
//     return res.sendStatus(400);
//   }
//   console.log('server.js l. 21. req.body = ', req.body);
//   console.log('server.js l. 22. req.body.username = ', req.body.username);
//   res.send('Welcome to Readcastly, ' + req.body.username + '! Nice to have you on board.');
// });

// to test bodyParser for json;
// app.post('/jsonTest', jsonParser, function(req, res) {
//   console.log('server.js l. 28: received POST to /jsonTest. Will read it now...');
//   console.log(req.body);
//   if(req.body === {}) {
//     console.log('server.js l. 30: jsonTest did not get an object to parse');
//     return res.sendStatus(400);
//   }
//   console.log('server.js l. 33: req.body should be an obj. body = ', req.body);
//   res.sendStatus(200);
// });

app.post('/deleteOne', function(req,res) {
  Articles.deleteOne(req.body.articleUser_id, function(deletedModel) {
    res.send(deletedModel);
  });
});

app.get('/topStories', function(req,res) {
  var options = {};
  utils.newsApiBuilder(req.source_id, function(optionsObj){
    options = optionsObj;
  });
  request(options, function(error, response, body) {
    res.send(body);
  });
});

var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log("Readcastly server listening intently on port: ", port);
});

module.exports = app;

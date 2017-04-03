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

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../client')));

// app.post('/requrl/:requrl', function(req, res) {
//   console.log('server.js, POST to /requrl/:requrl. l. 15: req received.');
//   let requrl = req.params.requrl;
//   console.log('server.js POST to requrl. l. 14. req.params.url = ', req.params.requrl);

// receive POST req of URL user wants to hear; send GET req to Mercury & receive obj w/ parsed data; send to dbController; (will refactor to pull out routes at least)
app.post('/requrl', function(req, res) {
  console.log('server.js, POST to /requrl. l. 20: req received. body = ', req.body);
  let requrl = req.body.requrl;
  console.log('server.js POST to requrl. l. 14. requrl = ', requrl);

  var objToSaveToDB = {
    url: requrl,
    user_id: User.user_id || 99
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
    };
    var parsedBody = JSON.parse(body);
    objBuilder(objToSaveToDB,parsedBody);
    Articles.create(objToSaveToDB,function(library){
      res.send(library);
    })
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
  Articles.getAll(99, function(library) {
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

var port = process.env.PORT;

app.listen(port, function() {
  console.log("Readcastly server listening intently on port: ", port);
})

var objBuilder = function(obj,source) {
    obj.title = source.title;
    obj.text = source.content;
    obj.author = source.author;
    obj.publication_date = source.date_published;
    obj.image = source.lead_image_url;
    obj.excerpt = source.excerpt;
    obj.word_count = source.word_count;
    // obj.est_time = source.word_count*2;
    obj.est_time = source.word_count / 145; // based on 145 wpm avg. spoken speech
    obj.domain = source.domain;
}

module.exports = app;

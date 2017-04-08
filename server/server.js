require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const urlParser = bodyParser.urlencoded({extended: false});
const jsonParser = bodyParser.json();
const request = require('request');
const news = require('./apis/newsController');

//DO NOT REMOVE THE BELOW FUNCTION ... WE MAY NEED TO RUN IT AT SOME POINT IN THE FUTURE!!
//news.newsApiImport();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../client')));

// after MVP on 4.5 we will refactor to at least pull out routes

app.post('/requrl', function(req, res) {
  let requrl = req.body.requrl;
  console.log('server.js POST to requrl. l. 14. requrl = ', requrl);

  var objToSaveToDB = {
    url: requrl,
    user_id: User.currentUser || 99
  };

  request(utils.mercuryOptions(requrl), function (error, response, body) {
    if(error) {
      console.log('server.js, GET req to Mercury. error! = ', error);
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

// will need to switch out hard-coded '99' 3 lines below once login functionality established
app.get('/getAll', function(req, res) {
  console.log('server.js received GET req at /getAll . Returning array of objects with contents of Readcastly db!');
  Articles.getAll(/*User.currentUser*/99, function(library) {
    res.send(library);
  });
});

app.post('/deleteOne', function(req,res) {
  Articles.deleteOne(req.body.article_id, function(deletedModel) {
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

app.post('/deleteOne', function(req,res) {
  console.log('SERVER LINE 100**************', req.body);
  Articles.deleteOne(req.body.articleUser_id, function(deletedModel) {
    res.send(deletedModel);
  });
});

app.get('/signup', function(req,res) {
    res.send('This is our signup page :)');
});

var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log("Readcastly server listening intently on port: ", port);
});


require('./routes.js')(app, express);

module.exports = app;


// other routes we wrote to test and may use in future:

// app.post('/requrl/:requrl', function(req, res) {
//   console.log('server.js, POST to /requrl/:requrl. l. 15: req received.');
//   let requrl = req.params.requrl;
//   console.log('server.js POST to requrl. l. 14. req.params.url = ', req.params.requrl);

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

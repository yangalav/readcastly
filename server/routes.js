require('dotenv').config();
const request = require('request');
const Articles = require('./database/controllers/articlesController');
const User = require('./database/models/user');
const utils = require('./utils.js');
const mercury = require('./apis/mercuryController');
const news = require('./apis/newsController');
const mailer = require('./apis/mailController');
const texter = require('./apis/textController');

module.exports = function(app, express) {

  app.post('/requrl', function(req, res) {
    mercury.parseAndSave(req.body.requrl,function(result) {
      res.send(result);
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
    Articles.deleteOne(req.body.url, function(deletedModel) {
      res.send({"deleted": req.body.url});
    });
  });

  app.get('/topStories', function(req,res) {
    var options = {};
    news.newsApiBuilder(req.source_id, function(optionsObj){
      options = optionsObj;
    });
    request(options, function(error, response, body) {
      res.send(body);
    });
  });

  app.post('/mailer', function(req,res) {
    let readcast = utils.readcastBuilder(req.body);
    //req.body will need all fields required for conversion, including title, author, and source, at a minimum, in addition to text
    //invoke function that converts article to speech, grab path
    readcast.location = //path to file;
    mailer.sendMail(User.currentEmail,readcast,function(confirmation){
      res.send(confirmation);
    });
  });

  app.post('/texter', function(req,res) {
    let readcast = utils.readcastBuilder(req.body);
    //req.body will need all fields required for conversion, including title, author, and source, at a minimum, in addition to text
    //invoke function that converts article to speech, grab path - AUDIO FORMAT RETURNED MUST BE MP4, MPEG, OR OGG
    readcast.location = //path to file;
    texter.sendText(User.currentPhone,readcast,function(confirmation){
      res.send(confirmation);
    });
  });

};

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

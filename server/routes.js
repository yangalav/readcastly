require('dotenv').config();
const request = require('request');
const bodyParser = require('body-parser');
const Promise = require('bluebird');
const Articles = require('./database/controllers/articlesController');
const utils = require('./utils.js');
const mercury = require('./apis/mercuryController');
const news = require('./apis/newsController');
const mailer = require('./apis/mailController');
const texter = require('./apis/textController');
const polly = require('./apis/pollyController');
const path = require('path');
const async = require('async');

// To be written and passed into routes between endpoint and function
// const isLoggedIn = function(){};

module.exports = function(app, express, passport) {

  app.post('/requrl', function(req, res) {
    // console.log('server.js received POST req at /requrl. req.body = ', req.body);
    mercury.parseAndSave(req.body.userId, req.body.requrl, false, function(result) {
      res.send(result);
    });
  });

  app.get('/getAll', function(req, res) {
    console.log('server.js received GET req at /getAll . Returning array of objects with contents of Readcastly db!');
    Articles.getAll(req.query.userId, function(library) {
      // console.log('server/routes.js l 25, about to call utils.dbstats...');
      // utils.dbStats(library);
      // console.log('server/routes.js l 29, library sending to client = ', library);
      res.send(library);
    });
  });

  app.post('/deleteOne', function(req,res) {
    Articles.deleteOne(req.body.userId,req.body.url, function(deletedModel) {
      res.send({"deleted": req.body.url});
    });
  });

  app.get('/topStories', function(req,res) {
    console.log('routes.js GET req to /topStories, l 37. req.query.sources = ', req.query.sources);
    var newsSources = [];
    var sourceFromClient = req.query.sources;
    if(req.query.sources === 'pull-from-api') {
      sourceFromClient = 'ars-technica';
      news.newsApiImport(function(apiSources){
        newsSources = apiSources});
    }
    // else {newsSources = req.query.sources}
    var options = {};
    // news.newsApiBuilder(req.body.sources[1], function(optionsObj){
    news.newsApiBuilder(sourceFromClient, function(optionsObj){
      options = optionsObj;
    });
    request(options, function(error, response, body) {
      console.log('\n\nroutes.js POST req to /topStories');
      var parsedNewsObj = JSON.parse(body);
      // console.log('\n\nroutes.js GET req to /topStories, l 48. res body.articles from newsApi = ', parsedNewsObj.articles);
      res.send(parsedNewsObj.articles);
    });
  });

  app.post('/stream', function(req,res) {
    console.log('======BACK-A-routes.js-IN STREAM ENDPOINT');
    // console.log('PAYLOAD === ', req.body.payload);
    polly.textToSpeech(req, res, function(url, title) {
      console.log('SUCCESSFUL STREAM RETURN--url: ', url, 'title: ', title)
      res.send({url, title})
    });
  });

  app.post('/email', function(req,res) {
    // console.log('IN EMAIL ENDPOINT');
    // console.log('PAYLOAD === ', req.body.payload);
    mailer.sendMail(req,res,function(destination) {
      console.log(destination);
      res.send({"destination" : destination});
    });
  });

  app.post('/phone', function(req,res) {
    // console.log('IN PHONE ENDPOINT');
    // console.log('PAYLOAD === ', req.body.payload);
    texter.sendText(req,res,function(destination) {
      console.log('TEXT RES === ', destination);
      res.send({"destination" : destination})
    });
  });

  app.post('/link', function(req,res) {
    console.log('IN LINK ENDPOINT');
    // console.log('PAYLOAD === ', req.body.payload);
    polly.textToSpeech(req, res, function(url, title) {
      console.log('SUCCESSFUL STREAM RETURN--url: ', url, 'title: ', title)
      res.send({url, title})
    });
  });

  app.post('/guestStories', function(req,res) {
    news.guestStories(req.body.source, res);
  });

  app.get('/api/signup', function(req,res) {
      res.send('this is our signup page :)');
  });

  app.get('/api/login', function(req, res) {
    res.send('this is our login page :)');
  });

  app.get('/api/', isLoggedIn, function(req, res) {
    console.log('RENDER INDEX')
    app.use(express.static(path.join(__dirname, '../client')));
    res.sendFile(path.join(__dirname, '../client/index.html'), {
      user: req.user,
    });
  });

  app.post('/api/signup',
    passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  }))

  app.post('/api/login',
    passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  }))

  app.get('/api/logout', function(req, res) {
    console.log('req.isAuthenticated() = ' + req.isAuthenticated());
    req.logout();
    console.log('req.isAuthenticated() is now ' + req.isAuthenticated());
    res.end('/login');
  })

  //route middleware to make sure a user is logged in
  function isLoggedIn(req, res, next) {
    if(req.isAuthenticated())
      return next();

    res.redirect('/login');
  }

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


// sample newsapi response to https://newsapi.org/v1/articles?source=abc-news-au&apiKey= (Postman):
// {
//   "status": "ok",
//   "source": "abc-news-au",
//   "sortBy": "top",
//   "articles": [
//     {
//       "author": null,
//       "title": "Tillerson warns US-Russia relations 'at low point' after meeting Putin",
//       "description": "Relations between Moscow and Washington are at a low point, US Secretary of State Rex Tillerson says.",
//       "url": "http://www.abc.net.au/news/2017-04-13/tillerson-warns-us-russia-relations-at-low-point/8440646",
//       "urlToImage": "http://www.abc.net.au/news/image/8441238-1x1-700x700.jpg",
//       "publishedAt": "2017-04-12T20:51:22Z"
//     },
//     {
//       "author": "http://www.abc.net.au/news/thuy-ong/6365968",
//       "title": "AI coming sooner than you think, experts say",
//       "description": "Experts say artificial intelligence is coming sooner than you think and robotics will soon replace the work now being done by humans.",
//       "url": "http://www.abc.net.au/news/2017-04-13/artificial-intelligence-coming-sooner-than-you-think-experts-say/8440358",
//       "urlToImage": "http://www.abc.net.au/news/image/7970258-1x1-700x700.jpg",
//       "publishedAt": "2017-04-12T20:06:29Z"
//     },
//     {
//       "author": null,
//       "title": "''Ashamed' United Airlines CEO promises not to set police on passengers again",
//       "description": "United Airlines will no longer use police to remove passengers from full flights, the carrier's chief executive says.",
//       "url": "http://www.abc.net.au/news/2017-04-13/united-airline-wont-use-police-to-remove-passengers-anymore/8441410",
//       "urlToImage": "http://www.abc.net.au/news/image/8441412-1x1-700x700.jpg",
//       "publishedAt": "2017-04-12T20:42:54Z"
//     },
//     {
//       "author": null,
//       "title": "Melania Trump wins damages from Daily Mail over false escort claims",
//       "description": "The Daily Mail will pay an undisclosed sum to Melania Trump after it published an article saying she offered services beyond simply modelling in her former job.",
//       "url": "http://www.abc.net.au/news/2017-04-12/melania-trump-wins-damages-from-daily-mail-over-escort-article/8440602",
//       "urlToImage": "http://www.abc.net.au/news/image/7692726-1x1-700x700.jpg",
//       "publishedAt": "2017-04-12T13:08:59Z"
//     },
//     {
//       "author": "http://www.abc.net.au/news/dan-conifer/5189074",
//       "title": "Cashless welfare expansion being considered ahead of federal budget",
//       "description": "The Federal Government is giving its strongest indication yet that a Centrelink income management trial could be expanded to more communities.",
//       "url": "http://www.abc.net.au/news/2017-04-13/centrelink-cashless-welfare-trial-may-be-expanded/8441418",
//       "urlToImage": "http://www.abc.net.au/news/image/6857058-1x1-700x700.jpg",
//       "publishedAt": "2017-04-12T19:41:27Z"
//     },
//     {
//       "author": null,
//       "title": "Suspected Islamist arrested over Dortmund football attack",
//       "description": "A suspected Islamist is arrested in Germany in connection with an attack on the Borussia Dortmund football team bus, authorities say.",
//       "url": "http://www.abc.net.au/news/2017-04-12/suspected-islamist-arrested-in-dortmund-football-attack-probe/8440638",
//       "urlToImage": "http://www.abc.net.au/news/image/8436112-1x1-700x700.jpg",
//       "publishedAt": "2017-04-12T13:40:37Z"
//     },
//     {
//       "author": "http://www.abc.net.au/news/rural/lucy-barbour/4592772",
//       "title": "'Catastrophic' accident possible if drone regulations aren't tightened, senator says",
//       "description": "A Coalition senator is calling on the Federal Government to toughen up laws on the use of small drones.",
//       "url": "http://www.abc.net.au/news/2017-04-13/calls-to-reintroduce-red-tape-for-small-drone-use-lnp-senator/8440276",
//       "urlToImage": "http://www.abc.net.au/news/image/8075668-1x1-700x700.jpg",
//       "publishedAt": "2017-04-12T20:10:37Z"
//     },
//     {
//       "author": "http://www.abc.net.au/news/andie-noonan/6559670",
//       "title": "'Lost' 19th century Australian landscape painting back on display",
//       "description": "A painting by renowned Australian landscape artist Eugene von Guérard, which has not been seen by art scholars for almost 150 years, is rediscovered.",
//       "url": "http://www.abc.net.au/news/2017-04-13/lost-19th-century-australian-landscape-painting-rediscovered/8440522",
//       "urlToImage": "http://www.abc.net.au/news/image/8440576-1x1-700x700.jpg",
//       "publishedAt": "2017-04-12T20:39:59Z"
//     },
//     {
//       "author": null,
//       "title": "Analysis: Attacking North Korea? Surely Trump couldn't be that foolish",
//       "description": "Regardless of how current tensions in the Korean Peninsula plays out, the international community will ultimately have to accept and learn to manage a nuclear North Korea.",
//       "url": "http://www.abc.net.au/news/2017-04-12/attacking-north-korea-surely-trump-couldnt-be-that-foolish/8439370",
//       "urlToImage": "http://www.abc.net.au/news/image/8440478-1x1-700x700.jpg",
//       "publishedAt": "2017-04-12T20:44:49Z"
//     },
//     {
//       "author": null,
//       "title": "Olympic champ Chalmers falls to McEvoy at national swimming titles",
//       "description": "Cameron McEvoy continues his redemption following his Rio disappointment with victory over Olympic champion Kyle Chalmers at the national swimming titles.",
//       "url": "http://www.abc.net.au/news/2017-04-13/olympic-champion-kyle-chalmers-falls-to-cameron-mcevoy/8441446",
//       "urlToImage": "http://www.abc.net.au/news/image/8441434-1x1-700x700.jpg",
//       "publishedAt": "2017-04-12T20:17:37Z"
//     }
//   ]
// }

var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var urlParser = bodyParser.urlencoded({extended: false});
var jsonParser = bodyParser.json();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, './client')));

app.post('/requrl/:requrl', function(req, res) {
  let requrl = req.params.requrl;
  console.log('server.js POST to requrl. l. 14. req.params.url = ', req.params.requrl);
  res.status(200).send('Got your request to listen to the text of ' + req.params.requrl);

// res.status(200).send('Got your request to listen to the text ');
});

// to test; will update with the actual endpoint in next user story
app.get('/', function(req, res) {
  console.log('server.js received GET req at / . Readcastly is on its way to fame & fortune!');
  res.send('We heard your GET req and the diligent Readcastly hamsters are fast at work. All your wildest dreams will soon come true. Stay tuned for more exciting endpoints coming soon to a Postman near you.');
});

// to test urlParser; will update to add authentication route when we get to that story
app.post('/login', urlParser, function(req, res) {
  console.log('server.js l. 16: received POST to /login. Will read it now...');
  if(req.body === {}) {
    console.log('server.js l. 18 - urlParser says body is empty on this request: ', req);
    return res.sendStatus(400);
  }
  console.log('server.js l. 21. req.body = ', req.body);
  console.log('server.js l. 22. req.body.username = ', req.body.username);
  res.send('Welcome to Readcastly, ' + req.body.username + '! Nice to have you on board.');
})

// to test bodyParser for json;
app.post('/jsonTest', jsonParser, function(req, res) {
  console.log('server.js l. 28: received POST to /jsonTest. Will read it now...');
  console.log(req.body);
  if(req.body === {}) {
    console.log('server.js l. 30: jsonTest did not get an object to parse');
    return res.sendStatus(400);
  }
  console.log('server.js l. 33: req.body should be an obj. body = ', req.body);
  res.sendStatus(200);
})


var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Readcastly server listening intently on port:", port);
})

module.exports = app;

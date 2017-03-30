var express = require('express');
var app = express();

// to test; will update
app.get('/', function(req, res) {
  console.log('server.js received GET req at / . Readcastly is on its way to fame & fortune!');
  res.send('We heard your GET req and the diligent Readcastly hamsters are fast at work. All your wildest dreams will soon come true. Stay tuned for more exciting endpoints coming soon to a Postman near you.');
});

var port = 8999;
app.listen(port);
console.log('Readcastly server listening intently on port: ', port, '...yeah, baby!');

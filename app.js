var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express(); //aplikacja

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('javascript'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/html/login.html');
}); //pobieranie strony coś jak ping

app.get('/api/posts', function (req, res) {
  console.log('Wysłane');
  fs.readFile('posts.json', 'utf8', function (err, content) {
    if (err) {
      res.send(err);
    }
    res.send(content);
  });
});

app.post('/api/login', function (req, res) {
	if (req.body.username === 'damian' && req.body.password === '123') {
    res.sendFile(__dirname + '/html/main.html');
	} else {
		res.sendFile(__dirname + '/html/loginerr.html');
	}
});

app.listen(9876, function () {
  console.log('Application works on port 9876');
});

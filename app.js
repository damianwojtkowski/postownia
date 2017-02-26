var express = require('express');
var bodyParser = require('body-parser');
var app = express(); //aplikacja

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/html/login.html');
}); //pobieranie strony coś jak ping

app.post('/signin', function (req, res) {
	//console.log(req.body.username, req.body.password);

	if (req.body.username === 'damian' && req.body.password === '123') {
		res.sendFile(__dirname + '/html/main.html');

	} else {
		res.sendFile(__dirname + '/html/loginerr.html');
	}
});

app.listen(9876, function () {
  console.log('Application works on port 9876');
});

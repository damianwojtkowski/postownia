var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var ejs = require('ejs');
var app = express(); //aplikacja

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/html/login.html');
}); //pobieranie strony coś jak ping

app.get('/api/posts', function (req, res) {
  fs.readFile('posts.json', 'utf8', function (err, content) {
    if (err) {
      res.send(err);
    }
    res.send(content);
  });
});

app.get('/signup', function (req, res) {
  res.sendFile(__dirname + '/html/signup.html');
});

app.post('/api/signup', function (req, res) {
  fs.readFile('users.json', 'utf-8', function (err, content) {
    if (err){
      res.send(err);
    }
    var jsonUsers = JSON.parse(content);
    var user = req.body.username;
    var password = req.body.password;
    jsonUsers[user] = password;
    var json = JSON.stringify(jsonUsers);
    fs.writeFileSync('users.json', json);
    res.sendFile(__dirname + '/html/main.html');
  });
});

app.post('/api/newpost', function (req, res) {
  fs.readFile('posts.json', 'utf8', function (err, content) {
    if (err) {
      res.send(err);
    }
    var jsonData = JSON.parse(content);
    var obj = {};
    obj.user = req.body.nick;
    obj.postdate = new Date();
    obj.content = req.body.comment;
    jsonData.posts.push(obj);

    var json = JSON.stringify(jsonData);

    fs.writeFileSync('posts.json', json);
    var templateMain = fs.readFileSync(__dirname + '/html/main.ejs', 'utf-8');
    res.end(ejs.render(templateMain, {
      nickname: req.body.username
    }));
  });
});

app.post('/api/login', function (req, res) {
  fs.readFile('users.json', 'utf-8', function (err, content) {
    var jsonUsers = JSON.parse(content);
    var userPassword = jsonUsers[req.body.username];
    if (typeof userPassword === 'string') {
      if (userPassword === req.body.password) {
        var templateMain = fs.readFileSync(__dirname + '/html/main.ejs', 'utf-8');
        res.end(ejs.render(templateMain, {
          nickname: req.body.username
        }));
      } else {
        res.sendFile(__dirname + '/html/loginerr.html');
      }
    } else {
      res.sendFile(__dirname + '/html/signup.html');
    }
  });
});

app.listen(9876, function () {
  console.log('Application works on port 9876');
});

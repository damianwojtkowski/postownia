var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var ejs = require('ejs');
var app = express(); //aplikacja

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname));

var generatePosts = function(req, res) {
  fs.readFile('posts.json', 'UTF-8', function (err, content) {
    if (err) {
      res.send(err);
    }
    res.send(content);
  });
}

//delete posts
app.delete('/api/deletepost/:userNick/:deletedPostID', function (req, res) {
  fs.readFile('posts.json', 'UTF-8', function (err, content) {
    if (err) {
      res.send(err);
    }
    var deletedPostID = req.params.deletedPostID;
    var userNick = req.params.userNick;
    var posts = JSON.parse(content);
    posts.forEach(function (obj, index, array) {
      if (+deletedPostID === obj.postid && userNick === obj.user) {
        array.splice(index, 1);
      }
    });
    var json = JSON.stringify(posts);
    fs.writeFileSync('posts.json', json);
    generatePosts(req, res);
  });
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/html/login.html');
});

//send posts
app.get('/api/posts', function (req, res) {
  generatePosts(req, res);
});

//display Sign up page
app.get('/signup', function (req, res) {
  res.sendFile(__dirname + '/html/signup.html');
});

//send post to edit them
app.get('/api/loadeditcomment/:userNick/:loadedPostID', function (req, res) {
  fs.readFile('posts.json', 'UTF-8', function (err, content) {
    var loadedPostID = req.params.loadedPostID;
    var userNick = req.params.userNick;
    var posts = JSON.parse(content);
    var editablePost = '';
    posts.forEach(function (obj, index, array) {
      if (+loadedPostID === obj.postid && userNick === obj.user) {
        editablePost = obj.content;
      }
    });
    res.send({postID : loadedPostID, comment : editablePost});
  });
});

//sign up new account
app.post('/api/signup', function (req, res) {
  fs.readFile('users.json', 'UTF-8', function (err, content) {
    if (err){
      res.send(err);
    }
    var jsonUsers = JSON.parse(content);
    var user = req.body.username;
    var password = req.body.password;
    jsonUsers[user] = password;
    var json = JSON.stringify(jsonUsers);
    fs.writeFileSync('users.json', json);
    res.sendFile(__dirname + '/html/main.ejs');
  });
});

app.post('/api/newpost', function (req, res) {
  fs.readFile('posts.json', 'UTF-8', function (err, content) {
    if (err) {
      res.send(err);
    }
    var jsonData = JSON.parse(content);
    var obj = {};
    var date = new Date();
    obj.user = req.body.nick;
    obj.postdate = date;
    obj.content = req.body.comment;
    obj.postid = date.getTime();
    jsonData.push(obj);
    var json = JSON.stringify(jsonData);
    fs.writeFileSync('posts.json', json);
    var templateMain = fs.readFileSync(__dirname + '/html/main.ejs', 'UTF-8');
    res.end(ejs.render(templateMain, {
      nickname: req.body.nick
    }));
  });
});

app.post('/api/login', function (req, res) {
  fs.readFile('users.json', 'UTF-8', function (err, content) {
    var jsonUsers = JSON.parse(content);
    var userPassword = jsonUsers[req.body.username];
    if (typeof userPassword === 'string') {
      if (userPassword === req.body.password) {
        var templateMain = fs.readFileSync(__dirname + '/html/main.ejs', 'UTF-8');
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

app.post('/api/editpost/:nickname/:editpostID/:editedpost', function (req, res) {
  fs.readFile('posts.json', 'UTF-8', function (err, content) {
    nickname = req.params.nickname;
    editPostID = req.params.editpostID;
    editedPost = req.params.editedpost;
    currentDate = new Date();
    var posts = JSON.parse(content);
    posts.forEach(function(obj, index, array) {
      if (+editPostID === obj.postid && nickname === obj.user) {
        obj.content = editedPost;
        obj.postdate = currentDate;
      }
    });
    var json = JSON.stringify(posts);
    fs.writeFileSync('posts.json', json);
    generatePosts(req, res);
  });
});

app.listen(9876, function () {
  console.log('Application works on port 9876');
});

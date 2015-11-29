var express = require('express'),
    app = express(),
    path = require('path');

app.use(express.bodyParser());

var currentToken;

function validTokenProvided(req, res) {
  var userToken = req.body.token || req.param('token') || req.headers.token;

  if (!currentToken || userToken != currentToken) {
    return false;
  }

  return true;
}

var PRODUCTS = [
    {"id":"1", "keyword":"red", "file":"img/1.jpg", "name":"First Item"},
    {"id":"2", "keyword":"blue", "file":"img/2.jpg", "name":"Second Item"},
    {"id":"3", "keyword":"mobile", "file":"img/3.jpg", "name":"Third Item"},
    {"id":"4", "keyword":"accessory", "file":"img/4.jpg", "name":"Fourth Item"},
    {"id":"5", "keyword":"red mobile", "file":"img/5.jpg", "name":"Fifth Item"},
    {"id":"6", "keyword":"blue mobile", "file":"img/6.jpg", "name":"Sixth Item"},
    {"id":"7", "keyword":"red accessory", "file":"img/7.jpg", "name":"Seventh Item"},
    {"id":"8", "keyword":"blue accessory", "file":"img/8.jpg", "name":"Eighth Item"},
    {"id":"9", "keyword":"red blue", "file":"img/9.jpg", "name":"Ninth Item"},
    {"id":"10", "keyword":"mobile accessory", "file":"img/10.jpg", "name":"Tenth Item"}
];

// AJAX auth route
app.post('/auth.json', function(req, res) {
  var body = req.body,
      username = body.username,
      password = body.password;

  if (username == 'moravia' && password == 'argentina') {
    currentToken = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    res.send({
      success: true,
      token: currentToken
    });
  } else {
    res.send({
      success: false,
      message: 'Invalid username/password'
    });
  }
});

// AJAX products route
app.get('/products.json', function(req, res) {
  if (validTokenProvided(req, res)) {
    res.send(PRODUCTS);
  }
  else
  {
    res.send(401, { error: 'Invalid token.' });
  }
});

// Login route
app.get('/login', function(req, res) {
  if (validTokenProvided(req, res)) {
    res.redirect('/');
  }
  else
  {
    res.sendfile(path.join(__dirname, 'login.html'));
  }
});

// Root route
app.get('/', function(req, res) {
  res.sendfile(path.join(__dirname, 'index.html'));
  /*if (validTokenProvided(req, res)) {
    res.sendfile(path.join(__dirname, 'index.html'));
  }
  else
  {
    res.redirect('/login');
  }*/
});

app.use(express.static(__dirname + '/public'));

app.listen(3000);
console.log('Listening on port 3000...');

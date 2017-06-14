var express = require('express');
var app = express();
app.listen(8122);

var db = require('./database.js');

app.post('/consumer/signup', db.postLogin);
app.get('/login', db.getLogin);
app.get('/search', db.getSearch);
app.get('/random/:n', db.getRandom);
app.post('/trade', db.postTrade);

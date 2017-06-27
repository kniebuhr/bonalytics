var express = require('express');
var app = express();
app.listen(8122);

var db = require('./database.js');

app.get('/itemday', db.getItemByDay);
app.get('/itemmonth', db.getItemByMonth);
app.get('/itemyear', db.getItemByYear);
app.get('/vendorday', db.getVendorByDay);
app.get('/vendormonth', db.getVendorByMonth);
app.get('/vendoryear', db.getVendorByYear);
app.get('/categoryday', db.getCategoryByDay);
app.get('/categorymonth', db.getCategoryByMonth);
app.get('/categoryyear', db.getCategoryByYear);
app.get('/consumerday', db.getConsumerByDay);
app.get('/consumermonth', db.getConsumerByMonth);
app.get('/consumeryear', db.getConsumerByYear);
app.post('/consumer/signup', db.postLogin);
app.get('/login', db.getLogin);
app.get('/search', db.getSearch);
app.get('/random/:n', db.getRandom);
app.post('/trade', db.postTrade);

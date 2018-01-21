var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')

var app = express();

// Get data from the database
app.get("/sensor/:id/:garage", function(request, response) {
  var id = request.params.id;
  var garage = request.params.garage;

  var uri="mongodb://n8houl:nah11796@seniordesign2-shard-00-00-ssssl.mongodb.net:27017,seniordesign2-shard-00-01-ssssl.mongodb.net:27017,seniordesign2-shard-00-02-ssssl.mongodb.net:27017/Garages?ssl=true&replicaSet=SeniorDesign2-shard-0&authSource=admin"
  var result;
  MongoClient.connect(uri, function(err, client) {
    assert.equal(null, err);
    const db = client.db('Garages');
    var cursor = db.collection('Garage' + garage.toUpperCase()).find({name: 'sensor_' + id + '_garage' + garage});
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      result = doc;
    }, function() {
      client.close();
      response.writeHead(200, {"Content-Type": "application/json"});
      response.write(JSON.stringify(result));
    });
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

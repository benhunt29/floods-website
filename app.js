const express = require('express');
const cors = require('cors')
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const dotEnv = require('dotenv').load();

const awsServerlessExpress = require('aws-serverless-express')
const app = express()
const server = awsServerlessExpress.createServer(app)
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
app.use(awsServerlessExpressMiddleware.eventContext())
app.use(cors())
var routes = require('./routes/index');
var events = require('./routes/events');
var news = require('./routes/news');

app.enable('trust proxy');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api/events', events);
app.use('/api/news', news);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.render('error', {message: 'That\'s a 404. You took a wrong turn.', imgSource: path.join('images', '404.jpg')});
});

// // error handlers
// app.use(function(req, res, next) {
//    if (err.status === 404 ) {
//        res.render('views/error');
//    }
// });

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log(err)
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);

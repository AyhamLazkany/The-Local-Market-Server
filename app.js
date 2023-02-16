var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');

var app = express();
var config = require('./config');
var indexRouter = require('./routes/index');
var userRouter = require('./routes/userRouter');
var storeRouter = require('./routes/storeRouter');
var productRouter = require('./routes/productRouter');
var favoriteRouter = require('./routes/favoriteRouter');
var bayRecRouter = require('./routes/bayRecRouter');
var saleRecRouter = require('./routes/saleRecRouter');
var uploadRouter = require('./routes/uploadRouter');

const mongoose = require('mongoose');
const connect = mongoose.connect(config.mongoUrl);

connect.then((db) => {
  console.log('Connected correctly to server');
}, (err) => console.log(err));

app.all('*', (req, res, next) => {
  if (req.secure) return next();
  else res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());


app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/stores', storeRouter);
app.use('/products', productRouter);
app.use('/favorites', favoriteRouter);
app.use('/bayRecs', bayRecRouter);
app.use('/saleRecs', saleRecRouter);
app.use('/upload', uploadRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

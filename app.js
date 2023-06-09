const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const hbs = require("hbs");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const locationsRouter = require('./routes/locations');

const helpers = require('./helpers/helpers');

const app = express();
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// helpers
hbs.registerHelper('round', helpers.round);
hbs.registerHelper('formatDate', helpers.formatDate);
hbs.registerHelper('capitalize', helpers.capitalize);
hbs.registerHelper('getTempUnit', helpers.getTempUnit);
hbs.registerHelper('getSpeedUnit', helpers.getSpeedUnit);
hbs.registerHelper('getWindDirection', helpers.getWindDirection);
hbs.registerHelper('setSelected', helpers.setSelected);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1);
app.enable('trust proxy');
 
// use session
app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 600000 // 60 * 1000 ms === 1 min
    }, // ADDED code below !!!
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI

      // ttl => time to live
      // ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
    })
  })
);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/locations', locationsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

mongoose
  .connect(process.env.MONGODB_URI)
  .then(x => {
    console.log(`Connected to Mongo database: "${x.connections[0].name}"`);
  })
  .catch(err => {
    console.log(`An error occurred while connecting to the Database: ${err}`);
  });

module.exports = app;

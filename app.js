const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// const session = require('express-session');
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const bcrypt = require('bcryptjs;');

require('dotenv').config();

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();

// mongoose connection setup
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URI || process.env.dev_db_url;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

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

// CREATE CONTROLLER FUNCTIONS TO GET THINGS FROM DATABASE, SAVE THINGS TO DATABASE, UPDATE THINGS IN DATABASE, AND DELETE THINGS IN DATABASE
// -- (REST) FETCH USERS (EXCLUDING EMAIL ADDRESS AND PASSWORD)
// -- (REST) FETCH CONVERSATIONS WITH A SPECIFIC MEMBER
// -- (REST) FETCH MESSAGES IN CONVERSATIONS WITH A SPECIFIC MEMBER
// -- (REST) CREATE USER
// -- (SOCKET) CREATE CONVERSATION
// -- (SOCKET) CREATE MESSAGE
// -- UPDATE USER INFO
// ------ (REST) PROFILE INFO ON ONE FUNCTION (FIRST NAME, LAST NAME, IMAGE, AND STATUS)
// ------ (SOCKET) UPDATE ONLINE STATUS IN ITS OWN
// -- UPDATE CONVERSATIONS
// ------ (REST) GROUP INFO IN ONE FUNCTION (IMAGE AND NAME)
// ------ (SOCKET? REST?) EXCLUSIONS IN ITS OWN FUNCTION (IF MEMBERS - EXCLUSIONS = 1, THEN DELETE CONVERSATION W/ MESSAGES)
// -- (SOCKET? REST?) DELETE A CONVERSATION (ALONG WITH ITS MESSAGES)

// TEST DATABASE FUNCTIONS IN POSTMAN

// add timestamps to test data at some point and make them required in schema

// SET UP PASSPORT AUTHENTICATION

// SET UP JWT
// VERIFY TOKEN ON CERTAIN ROUTES

// SET UP SOCKET.IO
// EMIT/RECEIVE FUNCTIONS WILL USE CONTROLLER FUNCTIONS TO UPDATE THINGS IN DATABASE

// figure out in app notifications

// make sure messages send on disconnection

// add demo user

// add images to test database

// add ability to change profile picture

// add ability to send images

// add login through google or github???

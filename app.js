const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const User = require('./models/user');
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();

// cors setup
const cors = require('cors');
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

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

// passport setup
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ email: username });
      if (!user) {
        return done(null, false, { message: 'Email does not exist, please try again' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect password, please try again' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

app.post('/api/login', (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json(info);
    } else {
      jwt.sign(
        { user: user },
        process.env.secret_key,
        /* { expiresIn: '1 day' }, */ (err, token) => {
          res.json({
            user: {
              _id: user._id,
              token: token,
            },
          });
        },
      );
    }
  })(req, res);
});

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

// SET UP SOCKET.IO
// EMIT/RECEIVE FUNCTIONS WILL USE CONTROLLER FUNCTIONS TO UPDATE THINGS IN DATABASE
// when login, connect to socket to set online status????
// on refresh, send token to backend to verify

// when sending a message, clear conversation exclusions if there are any

// add verifyToken back to routes

// Refactor socket code (move database logic to controller functions)

// figure out in app notifications

// make sure messages send on disconnection

// add demo user

// add images to test database

// add ability to change profile picture

// add ability to send images

// add login through google or github???

// go back later and change what is populating in queries!! only return fields that are needed in frontend!!

// refactor to put passport strategies in their own folder and move login function to routes

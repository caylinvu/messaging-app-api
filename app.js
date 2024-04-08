const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const compression = require('compression');
const helmet = require('helmet');
const bodyParser = require('body-parser');
require('dotenv').config();

const User = require('./models/user');
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();

// cors setup
const cors = require('cors');
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', process.env.ORIGIN],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// compression/helmet setup
app.use(compression());
app.use(helmet({ crossOriginResourcePolicy: false }));

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
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

app.post('/api/login', (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json(info);
    } else {
      jwt.sign({ user: user }, process.env.secret_key, (err, token) => {
        res.json({
          user: {
            _id: user._id,
            token: token,
          },
        });
      });
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

// ~~~~~~~~~~ ALL TO DO ~~~~~~~~~~

// ~~~~~~~~~~ REFACTOR TO DO ~~~~~~~~~~

// Socket.io
// Refactor socket code (move database logic to controller functions)
// Set up functions to manipulate things in socket events

// Maybe refactor some functions to take advantage of $push and $pull more

// Queries - only return fields that are needed in frontend

// Put passport strategies in their own folder and move login func to routes

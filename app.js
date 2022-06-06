require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/users')
const path = require('path');
const flash = require('connect-flash')
const favicon = require('serve-favicon')

const indexRouter = require ('./routes/index');

const mongoDb = process.env.DB_URL
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

passport.use(
  new LocalStrategy((username, password, done) =>{
    User.findOne({username: username}, (err, user) => {
      if (err){
        return done(err);
      }
      if(!user){
        return done(null, false, { message: 'Incorrect Username'});
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res){
          return done(null, user)
        } else {
          return done(null, false, { message: 'Incorrect password'});
        };
      })
    })
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  })
});

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

app.use(helmet());
app.use(logger('dev'));
app.use(cookieParser());
app.use(compression());
app.use(express.static(__dirname+'/public'));

app.use(session({ secret: 'dogs', resave: false, saveUninitialized: true}));
app.use(express.urlencoded({ extended: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
})
app.use(flash());

app.use('/', indexRouter);
app.use('/login', indexRouter);
app.use('/register', indexRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
})

//Error Handler
app.use(function(err, req, res, next){
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render error page
  res.status(err.status || 500)
  res.render('error')
});

app.listen(process.env.PORT, () => console.log(`app running on port ${process.env.PORT}`))


module.exports = app;
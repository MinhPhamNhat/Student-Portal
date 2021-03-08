var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'))

app.use('/', indexRouter);
app.use('/users', usersRouter);
require('./authenticate')
app.use(passport.initialize())

// google login
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// goole callback
app.get('/google/callback', passport.authenticate('google', {  failureRedirect: '/' }), (req, res)=>{
  var user = {
    name: req.user._json.name,
    email: req.user._json.email,
    avatar: req.user._json.picture,
    organization: req.user._json.hd === 'student.tdtu.edu.vn' ? 'TDTU student': 'Unknown'
  }
  res.render('profile', {user})
})

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


// Put your code down below


const PORT = process.env.PORT || 8080

app.listen(PORT, ()=> console.log("Listen on: http://localhost:8080"))

module.exports = app;

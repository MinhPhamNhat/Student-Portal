const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const passport = require('passport');
const jwt = require('jsonwebtoken')
const session = require('express-session')
const authen = require('./middleware/authenticateUser')
const socketio = require("socket.io")
const http = require('http')
const socketIO = require('./config/socketIO')
const flash = require("connect-flash")

require('dotenv').config()
require('./config/passport')
require('./config/database')


const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login')
const signoutRouter = require('./routes/signout')
const profileRouter = require('./routes/profile')
const statusRouter = require('./routes/status')
const notiRouter = require('./routes/notification')
const departmentRouter = require('./routes/department')

const app = express();
const server = http.createServer(app);
const io = socketio(server)
const PORT = 8080 || process.env.PORT 


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "MeoMeo" }))
app.use(passport.initialize())
app.use(passport.session())
    // route
app.use('/login', loginRouter)
app.use('/signout', authen.authen, signoutRouter)
app.use('/', indexRouter);
app.use('/profile', authen.authen, profileRouter)
app.use('/status', authen.authen, statusRouter);
app.use('/notification', authen.authen, notiRouter)
app.use('/department', authen.authen, departmentRouter)

app.locals.formatDate = (date) => {
    date = new Date(date)
    var day = date.getDate()/10>=1?date.getDate():"0"+date.getDate()
    var month = (date.getMonth()+1)/10>=1?(date.getMonth()+1):"0"+(date.getMonth()+1)
    var year = date.getFullYear()
    
    return `${day}/${month}/${year}`
  }
  app.locals.formatDateTime = (date) => {
    date = new Date(date)
    var day = date.getDate()/10>=1?date.getDate():"0"+date.getDate()
    var month = (date.getMonth()+1)/10>=1?(date.getMonth()+1):"0"+(date.getMonth()+1)
    var year = date.getFullYear()
    var minute = date.getMinutes()/10>=1?date.getMinutes():"0"+date.getMinutes()
    var hour = date.getHours()/10>=1?date.getHours():"0"+date.getHours()
    return `${day}/${month}/${year} ${hour}:${minute}`
  }
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

server.listen(PORT, () => console.log(`Listen on: http://localhost:${PORT}`))

socketIO.io.attach(server)
module.exports = app;
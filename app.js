const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser')
const passport = require('passport');
const { start } = require('repl');
const jwt = require('jsonwebtoken')
const session = require('express-session')
const authen = require('./repository/authenticateUser')
const mongoose = require('mongoose')
const socketio = require("socket.io")
const http = require('http')
const fs = require('fs')

require('./authenticate')
require('dotenv').config()

mongoose.connect(process.env.MONGODB_CONFIG, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login')
const accountRouter = require('./routes/account')
const profileRouter = require('./routes/profile')
const statusRouter = require('./routes/status')
const notiRouter = require('./routes/notificator')
const departmentRouter = require('./routes/department')

const app = express();
const server = http.createServer(app);
const io = socketio(server)
const PORT = process.env.PORT || 8080


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "MeoMeo" }))
app.use(passport.initialize())
app.use(passport.session())
    // route
app.use('/login', loginRouter)
app.use('/account', accountRouter)
app.use('/', indexRouter);
app.use('/profile', authen.authen, profileRouter)
app.use('/status', authen.authen, statusRouter);
app.use('/notification', authen.authen, notiRouter)
app.use('/department', authen.authen, departmentRouter)



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


io.on('connection', socket => {

    console.log(socket.id + " Just join server")

    socket.on('disconnect', () => {
        console.log(socket.id + " Just disconnect from server")
    })

    socket.on("send-data", (data) => {
        console.log(data)
    })
})

server.listen(PORT, () => console.log(`Listen on: http://localhost:${PORT}`))

module.exports = app;
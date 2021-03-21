const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser')
const passport = require('passport');
const jwt = require('jsonwebtoken')
const session = require('express-session')
const authen = require('./controller/authenticateUser')
require('dotenv').config()
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_CONFIG, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

require('./authenticate')

const Student = require('./models/student')
const Post = require('./models/post')

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login')
const accountRouter = require('./routes/account')
const profileRouter = require('./routes/profile')
const statusRouter = require('./routes/status')
const voteRouter = require('./routes/vote');
const notiRouter = require('./routes/notificator')
const departmentRouter = require('./routes/department')

const { start } = require('repl');
const app = express();

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

// google login
app.use('/login', loginRouter)
app.use('/account', accountRouter)
app.use('/', indexRouter);
app.use('/profile', authen.authen, profileRouter)
app.use('/status', authen.authen, statusRouter);
app.use('/vote', voteRouter)
app.use('/notification', authen.authen, notiRouter)
app.use('/department', authen.authen, departmentRouter)

// GET/ get all user
app.get('/user', (req, res, next) => {
    Student.find()
        .exec()
        .then(docs => {
            console.log(docs)
            res.status(200).json(docs)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: err })
        })
})

app.get('/getAllStatus', (req, res, next) => {
    Post.find()
        .exec()
        .then(docs => {
            res.status(200).send(JSON.stringify(docs))
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: err })
        })
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




const PORT = process.env.PORT || 8080

app.listen(PORT, () => console.log("Listen on: http://localhost:8080"))

module.exports = app;
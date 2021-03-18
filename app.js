const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://admin:3rdgC9NLKTV1PYd3@node-rest-student-porta.0bph9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const Student = require('./models/student')
const Post = require('./models/post')
const getPassedTime = require('./models/time')

const indexRouter = require('./routes/login');
const usersRouter = require('./routes/users');
const app = express();

var CURRENT_USER = '';
var USER_OBJ = '';
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);

require('./authenticate')
app.use(passport.initialize())

// Put your code down below

// google login

app.get('/header', (req, res) => {
    res.render('header')
})
app.get('/notification', (req, res) => {
    res.render('notification')
})
app.get('/account/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// goole callback
app.get('/account/google/callback', passport.authenticate('google', { failureRedirect: '/' }), async(req, res) => {
        if (req.user._json.hd !== 'student.tdtu.edu.vn') {
            return res.status(200).render('index', { message: "You must use <strong>Student email</strong> to sign in." })
        }
        // Check if student already in database
        await Student.find({ email: req.user._json.email }, async(err, doc) => {
            if (err) {
                console.log(err)
                res.status(500).json({ message: err })
            } else {
                // Add new student if not
                var student = {
                    _id: mongoose.Types.ObjectId(),
                    name: req.user._json.name,
                    sub: req.user._json.sub,
                    email: req.user._json.email,
                    avatar: req.user._json.picture,
                    initialTime: new Date()
                }
                if (!doc.length) {
                    await new Student(student).save()
                        .then(() => {
                            res.cookie('session_id', req.user._json.sub)
                            res.render('profile', { user: student })
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(500).json({ message: "asdsadasd" })
                        })
                        // Go to newfeed page if yes
                } else {
                    console.log("Already have " + req.user._json.name + " in MongoDB")
                    res.cookie('session_id', req.user._json.sub)
                    res.redirect('/newfeed')
                }


                USER_OBJ = student
                CURRENT_USER = req.user._json.sub
            }
        })
    })
    // check if cookie is right
const authenUser = (req, res, next) => {
    const { cookies } = req;
    if ('session_id' in cookies) {
        if (cookies.session_id === CURRENT_USER) next()
        else res.status(403).send({ message: "You are not Authenticated" })
    } else res.status(403).send({ message: "You are not Authenticated" })
}

// GET/ go to newfeed page
app.get('/newfeed', async(req, res, next) => {
    var posts = await Post.find()
        .sort({ date: 'desc' })
        .exec()
        .then(async docs => {
            if (!docs.length) {
                res.json({ message: "No post" })
            } else {
                var data = docs.map(async value => {
                    return Student.find({ _id: mongoose.Types.ObjectId(value.author) })
                        .exec()
                        .then(result => {
                            var post = {
                                attach: value.attach,
                                meta: value.meta,
                                _id: value._id,
                                content: value.content,
                                postTime: getPassedTime(value.postTime, new Date()),
                                author: value.author
                            }
                            return { post, author: result[0] }
                        })
                        .catch(console.log)
                });

                console.log(USER_OBJ)
                res.render('newfeed', { data: await Promise.all(data.reverse()), user: USER_OBJ })
            }
        })
        .catch(console.log)
})

app.get('/profile/:id', async(req, res, next) => {
    let id = req.params.id
    if (id) {
        await Student.find({ _id: mongoose.Types.ObjectId(id) }, (err, doc) => {
            if (err) {
                return res.json({ code: 4, message: "failed to find student", json: err })
            } else {
                Post.find({ author: id }, (postErr, postResult) => {
                    if (postErr) {
                        return res.json({ code: 4, message: "failed to find post", json: postErr })
                    } else {
                        var data = []

                        data = postResult.map(value => {
                            var post = {
                                attach: value.attach,
                                meta: value.meta,
                                _id: value._id,
                                content: value.content,
                                postTime: getPassedTime(value.postTime, new Date()),
                                author: value.author
                            }
                            return { post, author: doc[0] }
                        })
                        res.render('profile', { user: USER_OBJ, userProfile: doc[0], data })
                    }
                })
            }
        })
    } else {
        res.json({ code: 1, message: "Invalid user id" })
    }
})

// POST/ Post status to newfeed
app.post('/status', async(req, res, next) => {
    console.log("SUB:" + req.body.poster)
    await Student.find({ sub: req.body.poster }, (err, doc) => {
        console.log(doc)
        if (err) {
            console.log(err)
            res.status(500).json({ code: 3, message: "Failed to find student", json: err })
        } else {
            if (doc.length) {
                new Post({
                        _id: mongoose.Types.ObjectId(),
                        content: req.body.content,
                        postTime: new Date(),
                        author: mongoose.Types.ObjectId(doc[0]._id),
                        attach: {
                            picture: '',
                            video: '',
                        },
                        comments: [],
                        meta: {
                            likes: 0,
                            comments: 0,
                        }
                    }).save()
                    .then((result) => {
                        var author = Student.find({ _id: mongoose.Types.ObjectId(result.author) })
                            .exec()
                            .then(author => {

                                var post = {
                                    attach: result.attach,
                                    meta: result.meta,
                                    _id: result._id,
                                    content: result.content,
                                    postTime: getPassedTime(result.postTime, new Date()),
                                    author: result.author
                                }
                                res.status(200).json({ post, author: author[0] })
                            })
                            .catch(console.log)

                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({ message: err })
                    })
            } else {
                res.json({ code: 1, message: "Invalid user id" })
            }
        }
    })


})

// Get post page
app.get('/post/:id', (req, res, next) => {
    let id = req.params.id
    if (id) {
        Post.find({ _id: id })
            .exec()
            .then(result => {
                console.log(result)
                res.json({ code: 0, message: "Ok", json: result })
            })
            .catch(err => {
                res.json({ code: -1, message: "Get post failed", json: err })
            })
    } else {
        res.json({ code: 1, message: "Invalid id" })
    }
})


// Upload comment
app.post('/post', (req, res, next) => {
    let id = req.body.id
    let authorID = req.body.authorID
    let content = req.body.content
    console.log("id: " + id + " author: " + authorID + " content: " + content)
    if (id) {
        // $push: { comments: { body: content, date: new Date(), author: authorID } }
        Post.findByIdAndUpdate({ _id: id }, { $push: { comments: { body: content, date: new Date(), author: authorID } } }, { new: true })
            .exec()
            .then(result => {
                console.log(result)
                res.json({ code: 0, message: "Successfully upload comment", json: result })
            })
            .catch(err => {
                res.json({ code: 2, message: "Upload comment failed", json: err })
            })
    } else {
        res.json({ code: 1, message: "Invalid id" })
    }
})

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
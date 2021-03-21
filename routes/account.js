const express = require('express')
const router = express.Router()
const passport = require('passport');
const mongoose = require('mongoose');
const Student = require('../models/student');
const { deleteOne } = require('../models/student');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// goole callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), async(req, res) => {
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
                res.redirect('/')
            }
        }
    })
})


module.exports = router
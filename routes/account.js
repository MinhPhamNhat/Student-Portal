const express = require('express')
const router = express.Router()
const passport = require('passport');
const mongoose = require('mongoose');
const Student = require('../models/student');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// goole callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), async(req, res) => {
    if (req.user._json.hd !== 'student.tdtu.edu.vn') {
        return res.status(200).render('index', { message: "You must use <strong>Student email</strong> to sign in." })
    }
    // Check if student already in database
    await Student.findOne({ email: req.user._json.email }, async(err, doc) => {
        if (err) {
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
            if (!doc) {
                await new Student(student).save()
                    .then((result) => {
                        res.render('profile', { user: student })
                    })
                    .catch(err => {
                        res.cookie('userID', doc._id)
                        res.status(500).json({ message: "asdsadasd" })
                    })
                    // Go to newfeed page if yes
            } else {
                res.cookie('userID', doc._id)
                res.redirect('/')
            }
        }
    })
})


module.exports = router
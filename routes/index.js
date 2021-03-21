const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const Student = require('../models/student')
const Vote = require('../models/vote')
const Post = require('../models/post')
const getPassedTime = require('../models/time')
const status = require('../controller/status')

// GET/ go to newfeed page
router.get('/', async(req, res, next) => {
    if (req.user) {
        status.findStatusWithVote(req)
            .then(result => JSON.parse(result))
            .then(data => {
                if (data.code === 0) {
                    res.render('newfeed', { data: data.data, user: req.user._json })
                }
            })
            .catch(err => {
                res.json({ code: -1, message: "Failed", json: err })
            })
    } else {
        res.redirect('/login')
    }

})

module.exports = router;
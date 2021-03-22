const express = require('express')
const router = express.Router()
const status = require('../repository/status')
const mongoose = require('mongoose')
const User = require('../models/user')
// GET/ go to newfeed page
router.get('/', async (req, res, next) => {
    if (req.user) {
        status.findStatus(req, { skip: 0, limit: 5 })
            .then(result => JSON.parse(result))
            .then( data => {
                if (data.code === 0) {
                    //  User.findOneAndUpdate({ 
                    //     userId: req.user._json.sub 
                    // },  
                    //     { $push: {"data.user": req.user._json}
                    //     } 
                    // ).exec()
                    //     .then(async result => {
                    //     })

                    res.render('newfeed', { data: data.data, user: req.user._json })
                }
            })
    } else {
        res.redirect('/login')
    }

})

module.exports = router;
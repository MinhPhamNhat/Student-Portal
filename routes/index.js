const express = require('express')
const router = express.Router()
const status = require('../repository/status')

// GET/ go to newfeed page
router.get('/', async(req, res, next) => {
    if (req.user) {
        status.findStatus(req,{skip: 0,  limit:5})
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
const express = require('express')
const router = express.Router()
const status = require('../repository/status')

// GET/ go to newfeed page
router.get('/', async(req, res, next) => {
    if (req.user) {
        status.findStatus(req, { skip:0, limit: 5 })
        .then(result => JSON.parse(result))
        .then(data => res.render('index', { user: req.user, data: data.data }))
    } else {
        res.redirect('/login')
    }

})

module.exports = router;
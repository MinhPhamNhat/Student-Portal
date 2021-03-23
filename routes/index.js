const express = require('express')
const router = express.Router()
const status = require('../repository/status')

// GET/ go to newfeed page
router.get('/', async (req, res, next) => {
    if (req.user) {
        res.render('index', { user: req.user._json })
    } else {
        res.redirect('/login')
    }

})

module.exports = router;
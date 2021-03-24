const express = require('express')
const router = express.Router()

// GET/ go to newfeed page
router.get('/', async(req, res, next) => {
    console.log(req.user)
    if (req.user) {
        res.render('index', { user: req.user })
    } else {
        res.redirect('/login')
    }

})

module.exports = router;
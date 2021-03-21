const express = require('express')
const router = express.Router()

// GET/ go to newfeed page
router.get('/', (req, res, next) => {
    res.render('department', { user: req.user._json })

})

module.exports = router;
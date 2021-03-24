const express = require('express')
const router = express.Router()
    // GET profile page
router.get('/', (req, res, next) => {
    req.logOut()
    res.redirect('/login')

})

module.exports = router
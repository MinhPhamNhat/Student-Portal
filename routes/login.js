const express = require('express')
const router = express.Router()
const passport = require('passport');
// GET/ go to newfeed page
router.get('/', (req, res, next) => {
    if (req.user) {
        res.redirect('/')
    } else {
        var message = req.flash("error")
        res.render('login', {message})
    }

})

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// goole callback
router.get('/google/callback', passport.authenticate('google', { 
    successReturnToOrRedirect: '/', 
    failureRedirect: '/login',
    failureFlash : true }))


router.post('/', passport.authenticate("local", { successReturnToOrRedirect: '/', failureRedirect: '/login' }), async(req, res, next) => {

})


module.exports = router;
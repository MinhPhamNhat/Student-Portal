const express = require('express')
const router = express.Router()
const passport = require('passport');
// GET/ go to newfeed page
router.get('/', (req, res, next) => {
    if (req.user) {
        res.redirect('/')
    } else {
        res.render('login')
    }

})

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// goole callback
router.get('/google/callback', passport.authenticate('google', { successReturnToOrRedirect: '/', failureRedirect: '/login' }), async(req, res) => {
    if (req.user.hd !== 'student.tdtu.edu.vn') {
        return res.status(200).render('index', { message: "You must use <strong>Student email</strong> to sign in." })
    }
    res.redirect('/')
})


router.post('/', passport.authenticate("local", { successReturnToOrRedirect: '/', failureRedirect: '/login' }), async(req, res, next) => {

})


module.exports = router;
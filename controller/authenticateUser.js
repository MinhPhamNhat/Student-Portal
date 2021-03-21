module.exports = {
    authen: (req, res, next) => {
        if (req.user) {
            next()
        } else {
            res.redirect('/login')
        }
    }
}
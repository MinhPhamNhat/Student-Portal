module.exports = {
    authen: (req, res, next) => {
        if (req.user) {
            if (req.user.role.admin || req.user.role.department) {
                next()
            } else if (req.user.role.student) {
                if (req._parsedUrl.path === '/department/insert') {
                    res.end("Access denied")
                } else {
                    next()
                }
            } else {
                res.redirect('/login')
            }
        } else {
            res.redirect('/login')
        }
    }
}
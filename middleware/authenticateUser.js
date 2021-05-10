module.exports = {
    authen: (req, res, next) => {
        if (req.user) {
            next()
        } else {
            res.redirect('/login')
        }
    },

    adminAuthen: (req, res, next) => {
        if (req.user.role.admin){
            next()
        }else{
            res.end("Access denied")
        }
    },

    studentAuthen: (req, res, next) => {
        if(req.user.role.student){
            res.end("Access denied")
        }else{
            next()
        }
    }
}
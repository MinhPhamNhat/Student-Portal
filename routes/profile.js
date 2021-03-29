const express = require('express')
const router = express.Router()
const status = require('../repository/status')
const user = require('../repository/user')

    // GET profile page
router.get('/:id', async(req, res, next) => {
    let id = req.params.id
    if (id) {
        var userProfile = await user.getUser(id)
        .then(result => JSON.parse(result))
        .then(data => data)
        if (userProfile.code === 0){
            var data = await status.findStatus(req, { skip:0, limit: 5 }, id)
            .then(result => JSON.parse(result))
            .then(data => data)
            if (data.code === 0){
                res.render('profile', { user: req.user, data: data.data, userProfile: userProfile.data, isCurrentUser: id===req.user._id?true:false })
            }else{
                return res.json({ code: 2, message: data.message })
            }
        }else{
            return res.json({ code: 3, message: userProfile.message })
        }
    } else {
        return res.json({ code: 1, message: "Invalid user id" })
    }
})


module.exports = router
const express = require('express')
const router = express.Router()

const status = require('../repository/status')
// GET profile page
router.get('/:id', async(req, res, next) => {
    let id = req.params.id
    if (id) {
        var userProfile = await user.checkStudent(id)
        if (userProfile){
            var data = JSON.parse(await status.findStatus(req, {skip:0, limit:5}, id))
            res.render('profile', { user: req.user._json, userProfile, data: data.data })
        }else{
            return res.json({ code: 2, message: "User not found" })
        }
    } else {
        return res.json({ code: 1, message: "Invalid user id" })
    }
})

module.exports = router
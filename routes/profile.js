const express = require('express')
const router = express.Router()
const Status = require('../repository/status')
const User = require('../repository/user')
const Account = require('../repository/account')
const Noti = require('../repository/notification')
const validator = require('../middleware/validator')
const {validationResult} = require('express-validator')
const upload = require('../middleware/file')
const func = require("../function/function")
const { validate } = require('../models/user')

router.get('/change-password', async (req, res, next) => {
    res.render('change-pass', {user: req.user})
})

router.post('/change-password',validator.updatePassword(),async (req, res, next)=>{
    var validate = validationResult(req);
    if (validate.errors.length) {
        let errors = validate.mapped()
        res.json({ code: -3, errors })
    }else{
        var result = JSON.parse(await Account.updatePassword(req.user._id, req.body.oldPassword, req.body.newPassword))
        if (result.code===0){
            res.json({code: 0})
        }else if(result.code === -1){
            var errors = {
                oldPassword: {
                msg: 'Mật khẩu cũ không đúng',
                param: 'oldPassword',
              }
            }
            res.json({ code: -3, errors })
        }else{
            res.json({ code: -2})
        }
    }
})
// GET profile page
router.get('/:id', async(req, res, next) => {
    let id = req.params.id
    if (id) {
        var userProfile = await User.getUser(id)
        .then(result => JSON.parse(result))
        .then(data => data)
        if (userProfile.code === 0){
            var data = await Status.findStatus(req, { skip:0, limit: 5 }, id)
            .then(result => JSON.parse(result))
            .then(data => data)
            if (data.code === 0){
                
                var noties = JSON.parse(await Noti.getNotification({},0,5))
                res.render('profile', { user: req.user, data: data.data, userProfile: userProfile.data, isCurrentUser: id===req.user._id?true:false, noties: noties.data })
            }else{
                res.render("error")
            }
        }else{
            res.render("error")
        }
    } else {
        res.render("error")
    }
})

// GET/: / get profile json
router.get('/', async (req, res, next) =>{
    var userProfile = JSON.parse(await User.getUser(req.user._id))
    res.json(userProfile)
})

// POST/: / edit profile
router.post('/', upload.single('file') ,validator.updateProfile(), async (req, res, next) =>{
    var validate = validationResult(req)
    if (validate.errors.length) {
        let errors = validate.mapped()
        res.json({ code: -3, errors })
    }else{
        var data = req.body
        
        if (req.file) {
            data.avatar = func.convertImageToURL(req.file)
        }
        var userProfile = JSON.parse(await User.updateUser(req.user._id, data))
        res.json(userProfile)
    }
})
module.exports = router
const express = require('express')
const router = express.Router()
const Status = require('../repository/status')
const Noti = require('../repository/notification')
// GET/ go to newfeed page
router.get('/', async(req, res, next) => {
    if (req.user) {
        Status.findStatus(req, { skip:0, limit: 5 })
        .then(result => JSON.parse(result))
        .then(async data => {
            var noties = JSON.parse(await Noti.getNotification({},0,5))
            res.render('index', { user: req.user, data: data.data, noties: noties.data })
        })
    } else {
        res.redirect('/login')
    }
})

module.exports = router;
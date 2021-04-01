const express = require('express');
const { route } = require('.');
const { render } = require('../app');
const router = express.Router()

// GET/ go to newfeed page
router.get('/', (req, res, next) => {

    res.render('notification', { user: req.user })
})

// GET/ get department by id
router.get("/:id", (req, res, next) => {
    var id = req.params.id
    if (id) {
        res.render("notification")
    } else {
        res.json({ code: -1, message: "Invalid id" })
    }
})

module.exports = router;
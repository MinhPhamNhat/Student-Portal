const express = require('express');
const { render } = require('../app');
const router = express.Router()

// GET/ go to newfeed page
router.get('/', (req, res, next) => {
    res.render('notification', { user: req.user })

})

module.exports = router;
const express = require('express')
const router = express.Router()
const upload = require('../middleware/file')

// GET/ go to newfeed page
router.get('/', (req, res, next) => {
    res.render('department', { user: req.user })

})
router.get('/insert', (req, res, next) => {
    res.render('insert', { user: req.user })

})

router.post('/insert', upload.single('file'), (req, res, next) => {
    console.log(req.body)
    console.log(req.file)
    next();

})

module.exports = router;
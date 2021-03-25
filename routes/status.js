const express = require('express')
const router = express.Router()
const status = require('../repository/status')
const upload = require('../middleware/file')
const func = require('../function/function')
    // Get status
router.get('/', (req, res, next) => {
    var skip = Number(req.query.skip)
    status.findStatus(req, { skip, limit: 5 })
        .then(result => JSON.parse(result))
        .then(data => res.json(data))
})

// Post status
router.post('/', upload.single('file'), (req, res, next) => {
    if (req.file) {
        var asdasdafas = {
            content: req.body.content,
            image: func.convertImageToURL(req.file)
        };
    } else {
        var asdasdafas = {
            content: req.body.content,
        };
    }
    var userID = req.user._id
    status.postStatusToDB(asdasdafas, userID)
        .then(result => JSON.parse(result))
        .then(data => {
            if (data.code === 0) {
                res.json(data.data)
            } else {
                res.json(data)
            }
        })
})

// Vote status
router.put('/vote', (req, res, next) => {
        var body = JSON.parse(JSON.stringify(req.body))
        var statusid = body.statusid
        var userID = req.user._id
        if (statusid) {
            status.voteStatus(statusid, userID)
                .then(result => JSON.parse(result))
                .then(data => res.json(data)).catch(err => {
                    res.json({ code: -1, message: "Failed to vote status", json: err })
                })
        } else {
            return res.json({ code: -1, message: "Invalid id" })
        }
    })
    // Comment status
router.put('/comment', (req, res, next) => {
    var body = JSON.parse(JSON.stringify(req.body))
    var { statusid, content } = body
    var userID = req.user._id
    if (statusid) {
        status.insertComment(statusid, userID, content)
            .then(result => {
                return JSON.parse(result)
            })
            .then(data => res.json(data)).catch(err => {
                res.json({ code: -2, message: "Failed to comment status", json: err })
            })
    } else {
        return res.json({ code: -1, message: "Invalid id" })
    }
})

// Get comment
router.get('/comment', (req, res, next) => {
    var skip = Number(req.query.skip)
    var statusid = req.query.statusid
    if (statusid) {
        status.findComment(statusid, { skip, limit: 5 })
            .then(result => {
                return JSON.parse(result)
            })
            .then(data => res.json(data))
    } else {
        return res.json({ code: -1, message: "Invalid id" })
    }
})

// Get file upload
router.post('/uploadfile', upload.single('image'), (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file)
})

module.exports = router
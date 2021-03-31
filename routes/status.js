const express = require('express')
const router = express.Router()
const status = require('../repository/status')
const upload = require('../middleware/file')
const func = require('../function/function')
const { RequestTimeout } = require('http-errors')
const { route } = require('.')
const io = require("../config/socketIO")

// Get status
router.get('/', (req, res, next) => {
    let id = req.query.id
    var skip = Number(req.query.skip)
    status.findStatus(req, { skip, limit: 5 }, id)
        .then(result => JSON.parse(result))
        .then(data => res.json(data))
})

// Post status
router.post('/', upload.single('file'), (req, res, next) => {
    if (req.file) {
        var contentData = {
            content: req.body.content,
            image: func.convertImageToURL(req.file)
        };
    } else {
        var contentData = {
            content: req.body.content,
        };
    }
    var userID = req.user._id
    status.postStatus(contentData, userID)
        .then(result => JSON.parse(result))
        .then(data => res.json(data))
})

// Delete status
router.delete('/', (req, res, next) => {
    var { statusId } = req.body
    var userId = req.user._id
    if (statusId) {
        status.removeStatus(statusId, userId)
            .then(result => JSON.parse(result))
            .then(data => res.json(data))
    } else {
        return res.json({ code: -1, message: "Invalid id" })
    }
})

// Edit status
router.put('/', upload.single('file'), (req, res, next) => {
    if (req.file) {
        var contentData = {
            content: req.body.content,
            image: func.convertImageToURL(req.file)
        };
    } else {
        var contentData = {
            content: req.body.content,
        };
    }
    var { statusId } = req.body
    var userId = req.user._id
    if (statusId) {
        status.editStatus(contentData, statusId, userId)
            .then(result => JSON.parse(result))
            .then(data => res.json(data))
    } else {
        return res.json({ code: -1, message: "Invalid id" })
    }
})

// Vote status
router.put('/vote', (req, res, next) => {
        var body = JSON.parse(JSON.stringify(req.body))
        var statusId = body.statusId
        var userID = req.user._id
        if (statusId) {
            status.voteStatus(statusId, userID)
                .then(result => JSON.parse(result))
                .then(data => res.json(data)).catch(err => {
                    res.json({ code: -1, message: "Failed to vote status", json: err })
                })
        } else {
            return res.json({ code: -1, message: "Invalid id" })
        }
    })
    // Comment status
router.post('/comment', (req, res, next) => {
    var { statusId, content } = req.body
    var userId = req.user._id
    if (statusId) {
        status.insertComment(statusId, userId, content)
            .then(result => JSON.parse(result))
            .then(data => {
                io.io.emit("comment-send", data)
                res.json(data)
            })
    } else {
        return res.json({ code: -1, message: "Invalid id" })
    }
})

// delete comment
router.delete('/comment', (req, res, next) => {
    var body = JSON.parse(JSON.stringify(req.body))
    var { statusId } = body
    var userId = req.user._id
    if (statusId) {
        status.removeComment(statusId, userId)
            .then(result => JSON.parse(result))
            .then(data => res.json(data))
    } else {
        return res.json({ code: -1, message: "Invalid id" })
    }
})

// Get comment
router.get('/comment', (req, res, next) => {
    var skip = Number(req.query.skip)
    var statusId = req.query.statusId
    if (statusId) {
        status.findComment(statusId, { skip, limit: 5 })
            .then(result => JSON.parse(result))
            .then(data => res.json(data))
    } else {
        return res.json({ code: -1, message: "Invalid id" })
    }
})

// // Get file upload
// router.post('/uploadfile', upload.single('image'), (req, res, next) => {
//     const file = req.file
//     if (!file) {
//         const error = new Error('Please upload a file')
//         error.httpStatusCode = 400
//         return next(error)
//     }
//     res.send(file)
// })

module.exports = router
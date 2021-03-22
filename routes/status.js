const express = require('express')
const router = express.Router()
const status = require('../repository/status')
    // POST/ Post status to newfeed
router.get('/', (req, res, next) => {
    var skip = Number(req.query.skip)
    console.log(skip)
    status.findStatus(req,{skip,  limit:5})
        .then(result => JSON.parse(result))
        .then(data => res.json(data))
        .catch(err => res.json({ code: -1, message: "Failed", json: err }))
})

router.post('/', async(req, res, next) => {
    status.postStatusToDB(req)
        .then(result => JSON.parse(result))
        .then(data => {
            if (data.code === 0) {
                res.json(data.data)
            } else {
                res.json(data)
            }
        }).catch(err => {
            res.json({ code: -1, message: "Failed to post status", json: err })
        })
})

// Get post page
router.get('/:id', (req, res, next) => {
    let id = req.params.id
    if (id) {
        status.getStatusById(id)
            .then(result => JSON.parse(result))
            .then(data => {
                if (data.code === 0) {
                    res.json(data.data)
                } else {
                    res.json(data)
                }
            }).catch(err => {
                res.json({ code: -2, message: "Failed to get status", json: err })
            })
    } else {
        return res.json({ code: -1, message: "Invalid id" })
    }
})

// Get post page
router.put('/vote', (req, res, next) => {
    var body = JSON.parse(JSON.stringify(req.body))
    var postid = body.postid
    var userVote = body.userVote
    if (postid && userVote) {
        status.voteStatus(postid, userVote)
            .then(result => JSON.parse(result))
            .then(data => res.json(data)).catch(err => {
                res.json({ code: -1, message: "Failed to get status", json: err })
            })
    } else {
        return res.json({ code: -1, message: "Invalid id" })
    }
})

module.exports = router
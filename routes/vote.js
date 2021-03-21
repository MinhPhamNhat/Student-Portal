const express = require('express')
const router = express.Router()
const vote = require('../repository/vote')

router.post('/', async(req, res, next) => {
    let userVote = req.body.userVote
    let postVote = req.body.postVote
    if (userVote && postVote) {
        vote.voteToStatus(userVote, postVote)
            .then(result => JSON.parse(result))
            .then(data => res.json(data))
            .catch(err => {
                res.json({ code: -1, message: "Failed to vote", json: err })
            })
    } else
        res.json({ code: 1, message: "Invalid id" })
})

module.exports = router
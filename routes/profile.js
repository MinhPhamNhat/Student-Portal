const express = require('express')
const router = express.Router()

const status = require('../repository/status')
    // GET profile page
router.get('/:id', async(req, res, next) => {
    let id = req.params.id
    if (id) {
        status.findStatus(req, { skip, limit: 5 }, id)
            .then(result => JSON.parse(result))
            .then(data => res.json(data))
    } else {
        return res.json({ code: 1, message: "Invalid user id" })
    }
})

module.exports = router
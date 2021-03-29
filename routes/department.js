const express = require('express')
const router = express.Router()
const upload = require('../middleware/file')
const validator = require('../middleware/validator')
const { validationResult } = require("express-validator")
const account = require('../repository/account')
const user = require('../repository/user')
const func = require('../function/function')
const path = require('path');

// GET/ go to newfeed page
router.get('/', async(req, res, next) => {
    var result = JSON.parse(await user.getDepartment({ "role.department": true }))
    res.render('department', { user: req.user, data: result.data })

})
router.get('/insert', async(req, res, next) => {
    var result = JSON.parse(await user.getDepartment({ "role.department": true }))
    res.render('insert', { user: req.user, data: result.data })

})

router.post('/insert', upload.single('file'), validator.insertDepartmentValidator(), async(req, res, next) => {
    let validate = validationResult(req)
    if (validate.errors.length) {
        let errors = validate.mapped()
        res.json({ code: -1, errors })
    } else {
        if (!req.file) {
            var defaultImage = {
                path: path.join(__dirname, '../public/images/tdt_logo.png'),
                mimetype: 'image/png'
            }
        }
        var permission = [req.body.id]
        if (req.body.permission) {
            permission.push(...req.body.permission)
        }
        var data = req.body
        data.image = req.file ? func.convertImageToURL(req.file) : func.convertImageToURL(defaultImage)
        data.permission = permission
        var result = await account.checkInforDepartment(req.body)
        if (Object.keys(result).length) {
            res.json({ code: -1, errors: result })
        } else {
            var newDepartment = JSON.parse(await account.saveNewDepartment(data))
            res.json({ code: 0, data: newDepartment })
        }
    }

})

module.exports = router;
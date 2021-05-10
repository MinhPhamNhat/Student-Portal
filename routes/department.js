const express = require('express')
const router = express.Router()
const upload = require('../middleware/file')
const validator = require('../middleware/validator')
const { validationResult } = require("express-validator")
const account = require('../repository/account')
const Category = require('../repository/category')
const func = require('../function/function')
const path = require('path');
const authen = require('../middleware/authenticateUser')

// GET/ go to newfeed page
router.get('/', async(req, res, next) => {
    var result = await Category.getCategory()
    res.render('department', { user: req.user, data: result })

})


// GET/ get insert page
router.get('/insert',authen.adminAuthen, async(req, res, next) => {
    var result = await Category.getCategory()
    res.render('insert', { user: req.user, data: result })

})


// POST/ insert department
router.post('/insert',authen.adminAuthen, upload.single('file'), validator.insertDepartmentValidator(), async(req, res, next) => {
    let validate = validationResult(req)
    if (validate.errors.length) {
        let errors = validate.mapped()
        res.json({ code: -1, errors })
    } else {
        if (!req.file) {
            var defaultImage = {
                path: path.join(__dirname, '../public/images/tdtu_logo.png'),
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
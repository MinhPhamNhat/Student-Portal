const express = require('express');
const Noti = require("../repository/notification")
const Deparment = require("../repository/user")
const User = require('../repository/user')
const router = express.Router()
const func = require('../function/function')
const validator = require("../middleware/validator")
const {validationResult} = require("express-validator")
const authen = require('../middleware/authenticateUser')
const socketIo = require('../config/socketIO')

// GET/ go to notification page
router.get('/', async (req, res, next) => {
    var query = req.query
    var authorId
    if (query.department){
        var department = await User.getUserIdByDepartmentId(query.department)
        if (department)
        authorId = department._id
    }

    var queryParams = {
        authorId ,
        categoryId: query.category
    }
    Object.keys(queryParams).forEach(key => !queryParams[key] && delete queryParams[key])
    var page = parseInt(query.page)||1
    

    var noties = JSON.parse(await Noti.getNotification(queryParams, (page - 1)*10, 10, req.user._id))
    var departments = await Deparment.getDepartmentID()
    var numOfNoti = await Noti.getNumOfNoti(queryParams)
    var pageRange = func.createPageRange(page,  Math.ceil(numOfNoti/10))
    var searchUrl = {
        department: `${queryParams.categoryId?`category=${queryParams.categoryId}`:``}`,
        category: `${queryParams.authorId?`department=${query.department}`:``}`,
        page: `${queryParams.categoryId?`&category=${queryParams.categoryId}`:``}${queryParams.authorId?`&department=${query.department}`:``}`,
    }
    if(noties.code === 0)
        res.render('notification', { 
            user: req.user, 
            departments, 
            noties: noties.data, 
            pageRange, page, 
            searchUrl, 
            currentDepartment: query.department,
            currentCategory: queryParams.categoryId,
        })
    else res.render('error')
    
})

// GET/ get notification detail by id
router.get("/detail/:id", async (req, res, next) => {
    var id = req.params.id
    if (id) {
        var data = JSON.parse(await Noti.getNotiById(id, req.user._id))
        if (data.code === 0){
            res.render("notification-detail", { user: req.user, data: data.data})
        }else{
            res.render('error') 
        }
    } else {
        res.render('error')
    }
})

// GET/ get notification detail by id
router.get("/:id", async (req, res, next) => {
    var id = req.params.id
    if (id) {
        var data = JSON.parse(await Noti.getNotiById(id, req.user._id))
        res.json(data)
    } else {
        res.json({code: -3, message:"Invalid params"})
    }
})

// POST/ insert noti
router.post("/",authen.studentAuthen, validator.insertNotification(), async (req, res, next) => {
    var validate = validationResult(req)
    if(validate.errors.length){
        let errors = validate.mapped()
        res.json({ code: -3, errors })
    }else{
        var data = req.body;
        var newNoti  = JSON.parse(await Noti.insertNoti(data.categoryId, req.user._id, data))
        if (newNoti.code === 0){
            socketIo.io.emit("new-noti", newNoti.data)
        }
        res.json(newNoti)
    }
})

// DELETE/ delete noti
router.delete("/",authen.studentAuthen, async (req, res, next) => {
    var notiId = req.body.notiId
    if (notiId){
        var noti = JSON.parse(await Noti.removeNoti(req.user._id, notiId))
        res.json(noti)
    }else{
        res.json({code: -3, message:"Invalid params"})
    }
})

// POST/ update noti
router.post("/:notiId",authen.studentAuthen, validator.insertNotification(), async (req, res, next) => {
    var notiId = req.params.notiId
    if (notiId){
        var validate = validationResult(req)
        if(validate.errors.length){
            let errors = validate.mapped()
            res.json({ code: -3, errors })
        }else{
            var data = req.body;
            var updatedNoti  = JSON.parse(await Noti.updateNoti(req.user._id, notiId, data))
            res.json(updatedNoti)
        }
    }else{
        res.json({code: -4, message:"Invalid params"})
    }
})
module.exports = router;
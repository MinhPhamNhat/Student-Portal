const mongoose = require('mongoose')
const User = require('../models/user')
const Account = require('../models/account')

const parseAccount = (value) => {
    
}

module.exports = {
    saveNewStudent: async(user) => {
        return User.findOne({ email: user.email })
            .exec()
            .then(async(std) => {
                if (!std) {
                    return new Account({
                            _id: mongoose.Types.ObjectId(),
                            role: { student: true }
                        }).save()
                        .then(async result => {
                            var userObj = {
                                _id: result._id,
                                name: user.name,
                                sub: user.sub,
                                email: user.email,
                                avatar: user.picture,
                                role: { student: true },
                                initialTime: new Date()
                            }
                            return new User(userObj).save()
                                .then((result) => {
                                    return JSON.stringify({ code: 0, message: "new user", data: result })
                                })
                        })
                } else
                    return JSON.stringify({ code: 0, message: "already have user", data: std })
            })
    },

    checkAccount: async(username, password) => {

        return Account.findOne({ username, password }).exec()
            .then(result => {
                if (result) {
                    return User.findOne({ _id: result._id }).populate('permission')
                        .exec()
                        .then(data => {
                            return JSON.stringify({ code: 0, message: "Welcome", data })
                        })
                } else {
                    return JSON.stringify({ code: 1, message: "username or password is incorrect", data: result })
                }
            })

    },

    checkInforDepartment: async (data) => {
        return Account.findOne({ username: data.username }).exec()
        .then(async result=>{
            var errors = {}
            if (result){
                errors.username = { msg: "Đã có tên tài khoản phòng khoa" } 
            }
            await User.find({$or:[{email: data.email}, {departmentID: data.id}]}).exec()
            .then(userRes => {
                if (userRes.length){
                    userRes.forEach(value=>{
                        if (value.departmentID === data.id){
                            errors.id = { msg: "Đã có mã phòng khoa" }
                        }
                        if (value.email === data.email){
                            errors.email = { msg: "Đã có email phòng khoa" }
                        }
                    })
                }
                
            })
            return errors
        })
        
    },

    saveNewDepartment: async (data) => {
        return new Account({
            _id: mongoose.Types.ObjectId(),
            username: data.username,
            password: data.password,
            role: {department: true}
        }).save().then(async saveAcc => {
            return new User({
                _id: saveAcc._id,
                name: data.name,
                email: data.email,
                avatar: data.image,
                role: { department: true },
                departmentID: data.id,
                permission: data.permission
            }).save().then(saveUser=>{
                return JSON.stringify({code: 0, message:"success", data: saveUser})
            })
        })
    },

    updatePassword: async (userId, oldPassword, newPassword) =>{
        return await Account.findOneAndUpdate({ _id: userId , password: oldPassword }, {password: newPassword}).exec()
        .then(result => {
            if (result){
                return JSON.stringify({code: 0})
            }else{
                return JSON.stringify({code: -1})
            }
        }).catch(err => {
            return JSON.stringify({code:-2, err: err.msg})
        })
    }


}
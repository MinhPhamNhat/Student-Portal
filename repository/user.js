const mongoose = require('mongoose')
const User = require('../models/user')
const Account = require('../models/account')

const parseAccount = (value) => {

}

module.exports = {

    getDepartment: async() => {
        return User.find({ "role.department": true }).exec()
            .then(result => {
                return JSON.stringify({ code: 0, message: "success", data: result })
            })
    },

    getUser: async(userid) => {
        return await User.findOne({ _id: userid }).populate('permission').exec()
            .then(result => {
                if (result){
                    return JSON.stringify({ code: 0, message: "success", data: result })
                }else
                    return JSON.stringify({ code: -1, message: "User not found" })
            })
    },

    getDepartmentId: async(userid) => {
        return await User.findOne({ _id: userid }).select('departmentID').exec()
            .then(result => {
                return result
            })
    },

    getUserIdByDepartmentId: async(departmentID) => {
        return await User.findOne({ departmentID }).select('_id').exec()
            .then(result => {
                return result
            })
    },

    updateUser: async(userId, data) => {
        return await User.findOneAndUpdate({ _id: userId }, data).exec()
            .then(result => {
                if (result){
                    return JSON.stringify({code: 0})
                }else{
                    
                    return JSON.stringify({code: -1})
                }
            }).catch(err => {
                return JSON.stringify({code:-2, err: err.msg})
            })
    },
}
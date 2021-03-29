const mongoose = require('mongoose')
const User = require('../models/user')
const Account = require('../models/account')

const parseAccount = (value) => {
    
}

module.exports = {
    
    getDepartment: async (query) => {
        return User.find(query).exec()
        .then(result => {
            return JSON.stringify({code:0, message: "success", data: result})
        })
    },

    getUser: async (userid) => {
        return User.findOne({_id: userid}).exec()
        .then(result => {
            if (result)
                return JSON.stringify({code:0, message: "success", data: result})
            else
                return JSON.stringify({code:-1, message: "User not found"})
        })
    },



}
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
    }



}
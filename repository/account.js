const mongoose = require('mongoose')
const User = require('../models/user')
const Account = require('../models/account')

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
                    return User.findOne({ _id: result._id })
                        .exec()
                        .then(data => {
                            return JSON.stringify({ code: 0, message: "Welcome", data })
                        })
                } else {
                    return JSON.stringify({ code: 1, message: "username or password is incorrect", data: result })
                }
            })

    },

    // saveNewDepartment: (user, data) => {
    //     return Account.
    // }


}
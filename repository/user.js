const User = require('../models/user')

module.exports = {

    getDepartmentID: async() => {
        return await User.find({ $or : [{"role.department": true}, {"role.admin": true}] }, 'departmentID name').exec()
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
                    return JSON.stringify({code: -4})
                }
            }).catch(err => {
                return JSON.stringify({code:-1, err: err.msg})
            })
    },
}
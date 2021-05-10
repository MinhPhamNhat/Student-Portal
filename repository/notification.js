const Noti = require('../models/notification')
const User = require('../models/user')
module.exports = {

    getNotification: async (query, skip, limit) => {
        return await Noti.find(query).skip(skip).limit(limit).sort({date: -1}).populate('authorId categoryId').exec()
            .then(notiRes => {
                if (notiRes) {
                    return JSON.stringify({ code: 0, message: "Success", data: notiRes })
                } else {
                    return JSON.stringify({ code: -1, message: "Failed" })
                }
            })
    },

    getNotiByDepartmentId: async (departmentID) => {
        return await User.findOne({ departmentID }).exec()
            .then(departmentRes => {
                if (departmentRes) {
                    return Noti.find({ departmentId }).exec()
                        .then(notiRes => {
                            if (notiRes) {
                                return JSON.stringify({ code: 0, message: "Success", data: notiRes })
                            } else {
                                return JSON.stringify({ code: -1, message: "Department not found" })
                            }
                        })
                } else {

                }
            })

    },

    getNotiById: async (notiId) => {
        return await Noti.findOne({ _id: notiId }).populate('authorId categoryId').exec()
            .then(notiRes => {
                if (notiRes) {
                    return JSON.stringify({ code: 0, message: "Success", data: notiRes })
                } else {
                    return JSON.stringify({ code: -1, message: "Failed" })
                }
            })
    },
    
    insertNoti: async (categoryId, authorId, data) => {
        return await User.findOne({ _id: authorId }).exec()
            .then(async userRes => {
                if (userRes) {
                    var indexOfCategoryId = userRes.permission.indexOf(categoryId)
                    if (indexOfCategoryId === -1) {
                        if (!userRes.role.admin)
                        return JSON.stringify({ code: -2, message: "Bạn không có quyền đăng thông báo trong chuyên mục này" })
                    }
                    var newNoti = await new Noti({
                        authorId,
                        categoryId,
                        title: data.title,
                        subTitle: data.subTitle,
                        content: data.content,
                        isImportance: data.isImportance,
                        date: new Date()
                    }).save()
                    return JSON.stringify({ code: 0, message: "Tạo thông báo thành công", data: newNoti._id})
                } else {
                    return JSON.stringify({ code: -1, message: "Access denined" })
                }
            })
    },

    getNumOfNoti: async (query, skip) => {
        return await Noti.countDocuments(query).exec()
    },

}
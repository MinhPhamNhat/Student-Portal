const Noti = require('../models/notification')
const User = require('../models/user')

const parseNoti = async(noties, userId) => {
    return await Promise.all(noties.map(noti => {
        return {
            ...noti._doc,
            myNoti: noti.authorId._id === userId
        }
    }))
}

const parseSingleNoti = (noti, userId) => {
    return {
        ...noti._doc,
        myNoti: noti.authorId._id === userId
    }
}

module.exports = {

    getNotification: async (query, skip, limit, userId) => {
        return await Noti.find(query).skip(skip).limit(limit).sort({date: -1}).populate('authorId categoryId').exec()
            .then(async notiRes => {
                if (notiRes) {
                    return JSON.stringify({ code: 0, message: "Success", data: await parseNoti(notiRes, userId) })
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
                                return JSON.stringify({ code: 0, message: "Success", data: parseNoti(notiRes, userId)  })
                            } else {
                                return JSON.stringify({ code: -1, message: "Department not found" })
                            }
                        })
                } else {

                }
            })

    },

    getNotiById: async (notiId, userId) => {
        return await Noti.findOne({ _id: notiId }).populate('categoryId authorId').exec()
            .then(async notiRes => {
                if (notiRes) {
                    return JSON.stringify({ code: 0, message: "Success", data: parseSingleNoti(notiRes, userId) })
                } else {
                    return JSON.stringify({ code: -1, message: "Failed" })
                }
            })
            .catch(err=> {
                return JSON.stringify({
                code: -5, 
                message: "Access denined"
            })})
            
    },
    
    insertNoti: async (categoryId, authorId, data) => {
        return await User.findOne({ _id: authorId }).exec()
            .then(async userRes => {
                if (userRes) {
                    var indexOfCategoryId = userRes.permission.indexOf(categoryId)
                    if (indexOfCategoryId === -1) {
                        if (!userRes.role.admin)
                        return JSON.stringify({ 
                            code: -2, 
                            message: "Bạn không có quyền đăng thông báo trong chuyên mục này" })
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
                    return JSON.stringify({ 
                        code: 0, 
                        message: "Tạo thông báo thành công", 
                        data: await newNoti
                                .populate({ path: 'authorId', select: 'name' })
                                .populate({ path: 'categoryId', select: 'name' })
                                .execPopulate()
                            })
                } else {
                    return JSON.stringify({ 
                        code: -1, 
                        message: "Access denined" })
                }
            }).catch(err=>{
                return JSON.stringify({ 
                    code: -1, 
                    message: "Access denined" })
            })
    },

    updateNoti: async (authorId, notiId, newNoti) => {
        return await User.findOne({ _id: authorId }).exec()
            .then(async userRes => {
                if (userRes) {
                    var indexOfCategoryId = userRes.permission.indexOf(newNoti.categoryId)
                    if (indexOfCategoryId === -1) {
                        if (!userRes.role.admin)
                        return JSON.stringify({ 
                            code: -2, 
                            message: "Bạn không có quyền đăng thông báo trong chuyên mục này" 
                        })
                    }
                    return Noti.findOneAndUpdate({ _id: notiId, authorId }, newNoti,  {new: true, runValidators: true}).exec()
                    .then(notiRes => {
                        if(notiRes){
                            return JSON.stringify({ 
                                code: 0, 
                                message: "Thành công",
                                data: notiRes
                            })
                        }else{
                            return JSON.stringify({ 
                                code: -1, 
                                message: "Access denined" })
                        }
                    }).catch(err => {
                        return JSON.stringify({
                            code: -5, 
                            message: "Error" 
                        })
                    })
                } else {
                    return JSON.stringify({ 
                        code: -1, 
                        message: "Access denined" 
                    })
                }
            }).catch(err=>{
                return JSON.stringify({ 
                    code: -5, 
                    message: "Error" 
                })
            })
    },

    removeNoti: async (userId, notiId) => {
        return await Noti.findOneAndDelete({authorId: userId, _id: notiId}).exec()
        .then(notiRes => {
            if (notiRes){
                return JSON.stringify({
                    code: 0,
                    message: "Xoá thông báo thành công"
                })
            }else{
                return JSON.stringify({
                    code: -1,
                    message: "Xoá thất bại"
                })
            }
        })
        .catch(err => {
            return JSON.stringify({
                code: -5,
                message: "Lỗi khi xoá thông báo"
            })
        })
    },

    getNumOfNoti: async (query, skip) => {
        return await Noti.countDocuments(query).exec()
    },

}
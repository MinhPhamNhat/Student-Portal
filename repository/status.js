const mongoose = require('mongoose')
const User = require('../models/user')
const Post = require('../models/post')
const Comment = require('../models/comment')
const func = require('../function/function')
const post = require('../models/post')
const parsePost = async(postVal, userid) => {
    var user = await User.findOne({ _id: postVal.authorId }).exec()
        .then(userRes => userRes)
    var vote = postVal.meta.votes.find(id => id === userid) ? true : false
    var isDelete = user._id == userid ? true : false
    return user ? {
        attach: postVal.attach,
        meta: postVal.meta,
        _id: postVal._id,
        content: postVal.content,
        date: func.getPassedTime(postVal.date, new Date()),
        author: {
            name: user.name,
            picture: user.avatar,
            authorId: user._id,
            role: user.role.admin ? "ADMIN" : (user.role.department ? "Department" : "Student")
        },
        vote,
        isDelete
    } : {}
}

const parseComment = async(commentVal, userId) => {
    var user = await User.findOne({ _id: commentVal.authorId }).exec()
        .then(userRes => userRes)
    return user ? {
        _id: commentVal._id,
        statusId: commentVal.statusId,
        content: commentVal.content,
        author: {
            name: user.name,
            picture: user.avatar,
            authorId: user._id,
            role: user.role.admin ? "ADMIN" : (user.role.department ? "Department" : "Student")
        },
        myComment: userId===user._id,
        date: func.getPassedTime(commentVal.date, new Date()),
    } : {}
}

module.exports = {
    findAllStatus: async() => {
        return Post.find()
            .sort({ date: 'desc' })
            .exec()
            .then(async docs => {
                var data = docs.map(async value => {
                    return User.findOne({ _id: mongoose.Types.ObjectId(value.author) })
                        .exec()
                        .then(async result => {
                            return JSON.stringify({ code: 0, message: "success", data: { post, author: result } })
                        })
                });
                data = await Promise.all(data.reverse())
                return JSON.stringify({ code: 0, message: "success", data })
            })
    },

    findStatus: async(req, { skip, limit }, userid) => {
        return Post.find(userid ? { authorId: userid } : undefined)
            .sort({ date: -1 })
            .skip(skip).limit(limit)
            .exec()
            .then(async postRes => {
                var data = postRes.map(async value => {
                    return parsePost(value, req.user._id);
                })
                data = await Promise.all(data)
                return JSON.stringify({ code: 0, message: "success", data })
            })
    },

    postStatus: async(content, userId) => {
        return User.findOne({ _id: userId })
            .exec()
            .then(async userRes => {
                if (userRes) {
                    return new Post({
                            _id: mongoose.Types.ObjectId(),
                            content: content.content,
                            date: new Date(),
                            authorId: userRes._id,
                            attach: {
                                picture: content.image ? content.image : '',
                                video: '',
                            },
                            meta: {
                                votes: [],
                                comments: [],
                            }
                        })
                        .save()
                        .then(async(postRes) => {
                            var data = await parsePost(postRes, userId)
                            return JSON.stringify({ code: 0, message: "success", data })
                        })
                } else {
                    return JSON.stringify({ code: -2, message: "Cannot find user" })
                }
            })
    },

    removeStatus: async(statusId, userId) => {
        return Post.findOneAndDelete({ _id: statusId, authorId: userId }).exec()
            .then(postRes => {
                if (postRes) {
                    return JSON.stringify({ code: 0, message: "Success remove status" })
                } else {
                    return JSON.stringify({ code: -2, message: "Access denined" })
                }
            })
    },

    editStatus: async(content, statusId, userId) => {
        return Post.findOne({ _id: statusId, authorId: userId }).exec()
            .then(async postRes => {
                if (postRes) {
                    postRes.content = content.content
                    postRes.attach.picture = content.image ? content.image : ''
                    postRes.save()
                    var data = await parsePost(postRes, userId)
                    return JSON.stringify({ code: 0, message: "Success edit status", data })
                } else {
                    return JSON.stringify({ code: -2, message: "Access denined" })
                }
            })

    },

    voteStatus: async(statusId, userVoteId) => {
        return Post.findOne({ _id: statusId })
            .exec()
            .then(async result => {
                if (result) {
                    var indexOfUser = result.meta.votes.indexOf(userVoteId)
                    var message = "";
                    var vote = true
                    if (indexOfUser === -1) {
                        result.meta.votes.splice(0, 0, userVoteId)
                        message = "Successfully vote status"
                    } else {
                        result.meta.votes.splice(indexOfUser, 1)
                        message = "Successfully unvote status"
                        vote = false
                    }
                    return result.save().then(data => {
                        data = {
                            no_vote: data.meta.votes.length,
                            actionVote: vote
                        }
                        return JSON.stringify({ code: 0, message, data })
                    })
                }
            })
            .catch(err => {
                return JSON.stringify({ code: -1, message: "Get post failed", json: err })
            })
    },

    insertComment: async(statusId, userId, content) => {
        return Post.findOne({ _id: statusId })
            .exec()
            .then(postRes => {
                if (postRes) {
                    return User.findOne({ _id: userId })
                        .exec()
                        .then(stdResult => {
                            if (stdResult) {
                                return new Comment({
                                        _id: mongoose.Types.ObjectId(),
                                        statusId,
                                        content,
                                        authorId: stdResult._id,
                                        date: new Date()
                                    }).save()
                                    .then(async commentRes => {
                                        var comments = await parseComment(commentRes, userId)
                                        postRes.meta.comments.splice(0, 0, commentRes._id)
                                        postRes.save()
                                        return JSON.stringify({ code: 0, message: "Successfully posting Comment", data: { comments, no_comment: (postRes.meta.comments.length) } })
                                    })
                            } else {
                                return JSON.stringify({ code: -3, message: "User not found" })
                            }
                        })
                } else
                    return JSON.stringify({ code: -2, message: "Post not found", data: postRes })
            })
            .catch(err => {
                return JSON.stringify({ code: -1, message: "Get post failed", json: err })
            })
    },

    removeComment: async(statusId, commentId, authorId) => {
        return Post.findOne({ _id: statusId }).exec()
            .then(postRes => {
                if (postRes) {
                    return Comment.findOneAndDelete({ _id: commentId, authorId }).exec()
                        .then(commentRes => {
                            if (commentRes) {
                                var indexOfUser = postRes.meta.comments.indexOf(commentId)
                                postRes.meta.comments.splice(indexOfUser, 1)
                                postRes.save()
                                return JSON.stringify({ code: 0, message: "Success remove comment", data: { commentId, statusId, no_comment: (postRes.meta.comments.length) } })
                            } else {
                                return JSON.stringify({ code: -2, message: "Comment not found" })
                            }
                        })
                } else {
                    return JSON.stringify({ code: -3, message: "Post not found" })
                }
            })
            .catch(err => {
                return JSON.stringify({ code: -5, message: "Delete failed", json: err })
            })
    },

    findComment: async(statusId, { skip, limit }, userId) => {
        return Post.findOne({ _id: statusId })
            .exec()
            .then(async result => {
                if (result) {
                    return Comment.find({ statusId })
                        .sort({ date: -1 })
                        .skip(skip).limit(limit)
                        .exec()
                        .then(async commentRes => {
                            var data = commentRes.map(value => {
                                return parseComment(value, userId)
                            })
                            data = await Promise.all(data)
                            return JSON.stringify({ code: 0, message: "Success", data })
                        })
                }
            })
    },

}
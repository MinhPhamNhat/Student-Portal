const mongoose = require('mongoose')
const User = require('../models/user')
const Post = require('../models/post')
const Comment = require('../models/comment')
const func = require('../function/function')
const parsePost = (value, userid) => {
    var vote = value.meta.votes.find(userId => userId === userid) ? true : false
    var post = {
        attach: value.attach,
        meta: value.meta,
        _id: value._id,
        content: value.content,
        date: func.getPassedTime(value.date, new Date()),
        author: value.author,
        vote

    }
    return post
}

const parseComment = (value) => {
    return comments = {
        _id: value._id,
        statusId: value.statusId,
        content: value.content,
        author: value.author,
        date: func.getPassedTime(value.date, new Date()),
    }
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
                        .catch(console.log)
                });
                data = await Promise.all(data.reverse())
                return JSON.stringify({ code: 0, message: "success", data })
            })
            .catch(err => {
                return JSON.stringify({ code: -1, message: "Failed to get all status", json: err })
            })
    },

    findStatus: async(req, { skip, limit }, userid) => {
        return Post.find(userid ? { "author.authorId": userid } : undefined)
            .sort({ date: -1 })
            .skip(skip).limit(limit)
            .exec()
            .then(async result => {
                data = result.map(value => {
                    return parsePost(value, req.user._id);
                })
                data = await Promise.all(data)
                return JSON.stringify({ code: 0, message: "success", data })
            })
    },

    postStatusToDB: async(content, userID) => {
        return User.findOne({ _id: userID })
            .exec()
            .then(async result => {
                if (result) {
                    return new Post({
                            _id: mongoose.Types.ObjectId(),
                            content: content.content,
                            date: new Date(),
                            author: {
                                name: result.name,
                                picture: result.avatar,
                                authorId: result._id,
                                role: result.role.admin ? 'Admin' : (result.role.student ? "Student" : "Deparment")
                            },
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
                        .then((result) => {
                            var data = parsePost(result, userID)
                            return JSON.stringify({ code: 0, message: "success", data })
                        })
                } else {
                    return JSON.stringify({ code: -2, message: "Cannot find user" })
                }
            })
    },

    voteStatus: async(_id, userVoteId) => {
        return Post.findOne({ _id })
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

    insertComment: async(_id, userid, content) => {
        return Post.findOne({ _id })
            .exec()
            .then(result => {
                if (result) {
                    return User.findOne({ _id: userid })
                        .exec()
                        .then(stdResult => {
                            if (stdResult) {
                                return new Comment({
                                        _id: mongoose.Types.ObjectId(),
                                        statusId: _id,
                                        content,
                                        author: {
                                            name: stdResult.name,
                                            picture: stdResult.avatar,
                                            authorId: stdResult._id
                                        },
                                        date: new Date()
                                    }).save()
                                    .then(saveRes => {
                                        var comments = parseComment(saveRes)
                                        result.meta.comments.splice(0, 0, userid)
                                        result.save()
                                        return JSON.stringify({ code: 0, message: "Success to post Comment", data: { comments, no_comment: (result.meta.comments.length) } })
                                    })
                            } else {
                                return JSON.stringify({ code: -3, message: "No user founded", data: saveRes })
                            }
                        })
                } else
                    return JSON.stringify({ code: -2, message: "No post founded", data: result })
            })
            .catch(err => {
                return JSON.stringify({ code: -1, message: "Get post failed", json: err })
            })
    },

    findComment: async(statusId, { skip, limit }) => {
        return Post.findOne({ _id: statusId })
            .exec()
            .then(async result => {
                if (result) {
                    return Comment.find({ statusId })
                        .sort({ date: 'asc' })
                        .skip(skip).limit(limit)
                        .exec()
                        .then(async commentRes => {
                            var data = commentRes.map(value => {
                                return parseComment(value)
                            })
                            data = await Promise.all(data)
                            return JSON.stringify({ code: 0, message: "Success", data })
                        })
                }
            })
    },


}
const mongoose = require('mongoose')
const Student = require('../models/student')
const Post = require('../models/post')
const Comment = require('../models/comment')
const getPassedTime = require('../models/time')
const fs = require('fs')
module.exports = {
    findAllStatus: async () => {
        return Post.find()
            .sort({ date: 'desc' })
            .exec()
            .then(async docs => {
                var data = docs.map(async value => {
                    return Student.findOne({ _id: mongoose.Types.ObjectId(value.author) })
                        .exec()
                        .then(async result => {
                            var post = {
                                attach: value.attach,
                                meta: value.meta,
                                _id: value._id,
                                content: value.content,
                                postTime: getPassedTime(value.date, new Date()),
                                author: value.author
                            }
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

    findStatus: async (req, { skip, limit }, userid) => {
        return Post.find(userid ? { "author.authorId": userid } : undefined)
            .sort({ date: -1 })
            .skip(skip).limit(limit)
            .exec()
            .then(async result => {
                data = result.map(value => {
                    var vote = value.meta.votes.find(userId => userId === req.cookies.userID) ? true : false
                    return post = {
                        attach: value.attach,
                        meta: value.meta,
                        _id: value._id,
                        content: value.content,
                        date: getPassedTime(value.date, new Date()),
                        author: value.author,
                        vote
                    }
                })
                data = await Promise.all(data)
                return JSON.stringify({ code: 0, message: "success", data })
            })
    },

    postStatusToDB: async (content, userID) => {
        console.log(content)

        return Student.findOne({ _id: userID })
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
                            auhtorId: userID,
                        },
                        attach: {
                            picture: content.image?content.image:'',
                            video: '',
                        },
                        meta: {
                            votes: [],
                            comments: [],
                        }
                    })
                        .save()
                        .then((result) => {
                            var post = {
                                attach: result.attach,
                                meta: result.meta,
                                _id: result._id,
                                content: result.content,
                                date: getPassedTime(result.date, new Date()),
                                author: result.author
                            }
                            return JSON.stringify({ code: 0, message: "success", data: post })
                        })
                } else {
                    return JSON.stringify({ code: -2, message: "Cannot find user" })
                }
            })
    },

    voteStatus: async (_id, userVoteId) => {
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

    insertComment: async (_id, userid, content) => {
        return Post.findOne({ _id })
            .exec()
            .then(result => {
                if (result) {
                    return Student.findOne({ _id: userid })
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
                                        var comments = {
                                            _id: saveRes._id,
                                            statusId: saveRes.statusId,
                                            content: saveRes.content,
                                            author: saveRes.author,
                                            date: getPassedTime(saveRes.date, new Date()),
                                        }
                                        result.meta.comments.splice(0, 0, userid)
                                        result.save()
                                        return JSON.stringify({ code: 0, message: "Success to post Comment", data: { comments, no_comment: (result.meta.comments.length) } })
                                    })
                            } else {
                                return JSON.stringify({ code: -3, message: "No student founded", data: saveRes })
                            }
                        })
                } else
                    return JSON.stringify({ code: -2, message: "No post founded", data: result })
            })
            .catch(err => {
                return JSON.stringify({ code: -1, message: "Get post failed", json: err })
            })
    },

    findComment: async (statusId, { skip, limit }) => {
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
                                return {
                                    _id: value._id,
                                    statusId: value.statusId,
                                    content: value.content,
                                    author: value.author,
                                    date: getPassedTime(value.date, new Date()),
                                }
                            })
                            data = await Promise.all(data)
                            return JSON.stringify({ code: 0, message: "Success", data })
                        })
                }
            })
    },


}
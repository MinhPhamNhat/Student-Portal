const mongoose = require('mongoose')
const Student = require('../models/student')
const Post = require('../models/post')
const getPassedTime = require('../models/time')
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

    postStatusToDB: async (req) => {
        return Student.findOne({ _id: req.cookies.userID })
            .exec()
            .then(async result => {
                if (result) {
                    return new Post({
                        _id: mongoose.Types.ObjectId(),
                        content: req.body.content,
                        date: new Date(),
                        author: {
                            name: result.name,
                            picture: result.avatar,
                            auhtorId: req.cookies.userID,
                        },
                        attach: {
                            picture: '',
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
                        .catch(err => {
                            return JSON.stringify({ code: -1, message: "Error when handling Post status" })
                        })
                } else {
                    return JSON.stringify({ code: -2, message: "Cannot find user" })
                }
            }).catch(err => {
                return JSON.stringify({ code: -3, message: "Failed to find student" })
            })
    },

    getStatusById: async (id) => {
        return Post.findOne({ _id: id })
            .sort({ data: -1 })
            .exec()
            .then(result => {
                data = {
                    attach: value.attach,
                    meta: value.meta,
                    _id: value._id,
                    content: value.content,
                    date: getPassedTime(value.date, Date.now),
                    author: value.author
                }
                return JSON.stringify({ code: 0, message: "success", data })
            })
            .catch(err => {
                return JSON.stringify({ code: -1, message: "Get post failed", json: err })
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

    insertCommentStatus: async (_id, comment)=>{
        return Post.findOneAndUpdate({ _id, $push: {"meta.comments": comment}})
            .exec()
            .then(result=>{
                console.log(result)
                return JSON.stringify({ code: 0, message: "Success post comment", data: result })
            })
            .catch(err => {
                return JSON.stringify({ code: -1, message: "Get post failed", json: err })
            })
    },
}
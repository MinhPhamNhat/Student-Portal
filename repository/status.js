const mongoose = require('mongoose')
const Student = require('../models/student')
const Post = require('../models/post')
const Vote = require('../models/vote')
const getPassedTime = require('../models/time')
module.exports = {
    findAllStatus: async() => {
        return await Post.find()
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
                                postTime: getPassedTime(value.postTime, new Date()),
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

    findStatus: async(req, {skip, limit}, userid) => {
        return await Post.find(userid?{author: userid}:undefined)
        .sort({postTime: -1})
            .skip(skip).limit(limit)
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
                                postTime: getPassedTime(value.postTime, new Date()),
                                author: value.author
                            }
                            let vote = false

                            await Vote.exists({ userVote: req.user._json.sub, postVote: value._id })
                                .then(result => {
                                    return vote = result ? true : false
                                })
                            return { post, author: result, vote }
                        })
                });
                data = await Promise.all(data)
                return JSON.stringify({ code: 0, message: "success", data })
            }).catch(err => {
                return JSON.stringify({ code: 1, message: "fail", json: err })
            })
    },

    postStatusToDB: async(req) => {
        return await Student.findOne({ sub: req.body.poster })
            .exec()
            .then(async doc => {
                if (doc) {
                    return await new Post({
                            _id: mongoose.Types.ObjectId(),
                            content: req.body.content,
                            postTime: new Date(),
                            author: doc._id,
                            attach: {
                                picture: '',
                                video: '',
                            },
                            meta: {
                                likes: 0,
                                comments: 0,
                            }
                        }).save()
                        .then((result) => {
                            var post = {
                                attach: result.attach,
                                meta: result.meta,
                                _id: result._id,
                                content: result.content,
                                postTime: getPassedTime(result.postTime, new Date()),
                                author: result.author
                            }
                            return JSON.stringify({ code: 0, message: "success", data: { post, author: doc } })
                        })
                        .catch(err => {
                            return JSON.stringify({ code: -2, message: "Error when Post ", json: err })
                        })
                } else {
                    return JSON.stringify({ code: 1, message: "Invalid user id" })
                }

            }).catch(err => {
                return JSON.stringify({ code: 3, message: "Failed to find student", json: err })
            })
    },

    getStatusById: async(id) => {
        return await Post.findOne({ _id: id })
            .exec()
            .then(result => {
                var post = {
                    attach: result.attach,
                    meta: result.meta,
                    _id: result._id,
                    content: result.content,
                    postTime: getPassedTime(result.postTime, new Date()),
                    author: result.author
                }
                return JSON.stringify({ code: 0, message: "success", data: post })
            })
            .catch(err => {
                return JSON.stringify({ code: -1, message: "Get post failed", json: err })
            })
    }
}
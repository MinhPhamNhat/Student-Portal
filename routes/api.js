const mongoose = require('mongoose')
const Student = require('../models/student')
const Post = require('../models/post')
const Comment = require('../models/comment')
const Vote = require('../models/vote')
const getPassedTime = require('../models/time')
module.exports = {
        findAllStatus: () => {
            Post.find()
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
                                return { post, author: result }
                            })
                            .catch(console.log)
                    });
                    data = await Promise.all(data.reverse())
                    return JSON.stringify({ code: 0, message: "success", data })
                })
                .catch(err => {
                    return JSON.stringify({ code: -1, message: "Failed to get all status", json: err })
                })
        }
    }
    // POST/ Post status to newfeed
    // api.get('/findAllStatus', async(req, res, next) => {


// })

// api.get('/findAllStatusForId', async(req, res, next) => {
//     Post.find()
//         .sort({ date: 'desc' })
//         .exec()
//         .then(async docs => {
//             var data = docs.map(async value => {
//                 return Student.findOne({ _id: mongoose.Types.ObjectId(value.author) })
//                     .exec()
//                     .then(async result => {
//                         var post = {
//                             attach: value.attach,
//                             meta: value.meta,
//                             _id: value._id,
//                             content: value.content,
//                             postTime: getPassedTime(value.postTime, new Date()),
//                             author: value.author
//                         }
//                         let vote = false
//                         await Vote.exists({ userVote: req.user._json.sub, postVote: value._id })
//                             .then(result => vote = result ? true : false)
//                             .catch(err => {
//                                 res.end(JSON.stringify({ code: -2, message: "Failed to get vote", json: err }))
//                             })
//                         return { post, author: result, vote }
//                     })
//                     .catch(err => {
//                         res.end(JSON.stringify({ code: -3, message: "Failed to find student", json: err }))
//                     })
//             });
//             data = await Promise.all(data.reverse())
//             res.end(JSON.stringify({ code: 0, message: "success", data }))
//         })
//         .catch(err => {
//             res.end(JSON.stringify({ code: -1, message: "Failed to get all status", json: err }))
//         })
// })

// api.get('/findById', async(req, res, next) => {
//     await Student.findOne({ sub: req.body.poster }, (err, doc) => {
//         if (err) {
//             console.log(err)
//             res.status(500).json({ code: 3, message: "Failed to find student", json: err })
//         } else {
//             if (doc) {
//                 new Post({
//                         _id: mongoose.Types.ObjectId(),
//                         content: req.body.content,
//                         postTime: new Date(),
//                         author: doc._id,
//                         attach: {
//                             picture: '',
//                             video: '',
//                         },
//                         meta: {
//                             likes: 0,
//                             comments: 0,
//                         }
//                     }).save()
//                     .then((result) => {
//                         var post = {
//                             attach: result.attach,
//                             meta: result.meta,
//                             _id: result._id,
//                             content: result.content,
//                             postTime: getPassedTime(result.postTime, new Date()),
//                             author: result.author
//                         }
//                         return res.status(200).json({ post, author: doc })
//                     })
//                     .catch(err => {
//                         return res.json({ code: -2, message: "Error when Post ", json: err })
//                     })
//             } else {
//                 return res.json({ code: 1, message: "Invalid user id" })
//             }
//         }
//     })
// })

// module.exports = api
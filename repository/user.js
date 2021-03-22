
const mongoose = require('mongoose');
const Student = require('../models/student')

// GET profile page
// router.get('/:id', async(req, res, next) => {
//     let id = req.params.id
//     if (id) {
//         await Student.findOne({ _id: mongoose.Types.ObjectId(id) }, (err, doc) => {
//             if (err) {
//                 return res.json({ code: 4, message: "failed to find student", json: err })
//             } else {
//                 Post.find({ author: id }, async(postErr, postResult) => {
//                     if (postErr) {
//                         return res.json({ code: 4, message: "failed to find post", json: postErr })
//                     } else {
//                         var data = []
//                         data = postResult.map(async(value) => {
//                             var post = {
//                                 attach: value.attach,
//                                 meta: value.meta,
//                                 _id: value._id,
//                                 content: value.content,
//                                 postTime: getPassedTime(value.postTime, new Date()),
//                                 author: value.author
//                             };
//                             let vote = false;
//                             await Vote.exists({ userVote: req.user._json.sub, postVote: value._id })
//                                 .then(result => vote = result ? true : false)
//                                 .catch();
//                             return { post, author: doc, vote };
//                         })
//                         var data = await Promise.all(data.reverse())
//                         return res.render('profile', { user: req.user._json, userProfile: doc, data })
//                     }
//                 })
//             }
//         })
//     } else {
//         return res.json({ code: 1, message: "Invalid user id" })
//     }
// })

module.exports = {
        checkStudent: async (id) => {
            return await Student.findOne({ _id: mongoose.Types.ObjectId(id) }, (err, doc) => { 
            if (err) {
                return JSON.stringify({ code: 1, message: "failed to find student", json: err })
            } else {
                return JSON.stringify({ code: 0, message: "success", data: doc })
            }
        })
    }
}
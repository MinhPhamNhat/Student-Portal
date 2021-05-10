const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    content: String,
    date: Date,
    authorId: {type: String, require: true},
    attach: {
        picture: String,
        video: String,
    },
    meta: {
        votes: Array,
        comments: Array,
    }
});

module.exports = mongoose.model('posts', postSchema)
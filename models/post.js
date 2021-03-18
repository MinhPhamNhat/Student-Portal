const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    content: String,
    postTime: Date,
    author: String,
    attach: {
        picture: String,
        video: String,
    },
    meta: {
        likes: Number,
        comments: Number,
    }
});

module.exports = mongoose.model('Post', postSchema)
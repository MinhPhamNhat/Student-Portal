const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    content: String,
    date: Date,
    author: { name: String, picture: String, authorId: String },
    attach: {
        picture: Buffer,
        video: String,
    },
    meta: {
        votes: Array,
        comments: Array,
    }
});

module.exports = mongoose.model('Post', postSchema)
const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    content: String,
    postTime: Date,
    poster: String,
    picture: String,
    video: String,
    likes: Number,
    comments: Number
});

module.exports = mongoose.model('Post', postSchema)
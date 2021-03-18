const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    content: String,
    author: String,
    time: Date,
});

module.exports = mongoose.model('Comment', commentSchema)
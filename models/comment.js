const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    statusId: String,
    content: String,
    authorId: String,
    date: Date,
});

module.exports = mongoose.model('Comment', commentSchema)
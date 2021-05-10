const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    statusId: {type: String, require: true},
    content: {type: String, require: true},
    authorId: {type: String, require: true},
    date: Date,
});

module.exports = mongoose.model('comments', commentSchema)
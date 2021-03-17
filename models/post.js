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
    comments: [{ body: String, date: Date, author: String }],
    meta: {
        likes: Number,
        comments: Number,
    },
    like:[{id:String}]
});

module.exports = mongoose.model('Post', postSchema)
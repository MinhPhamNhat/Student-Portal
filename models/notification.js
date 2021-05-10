const mongoose = require("mongoose")

const notificationShema = mongoose.Schema({
    authorId: {type: String, ref: "users"},
    categoryId: {type: String, ref: "categories"},
    title: String,
    subTitle: String,
    content: String,
    isImportance: Boolean,
    date: Date,
    
});
module.exports = mongoose.model('notification', notificationShema)
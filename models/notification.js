const mongoose = require("mongoose")

const notificationShema = mongoose.Schema({
    authorId: String,
    departmentId: String,
    title: String,
    subTitile: String,
    content: String,
    attach: String,
    topic: String,
    date: Date,
});
module.exports = mongoose.model('notification', notificationShema)
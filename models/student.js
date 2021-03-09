const mongoose = require('mongoose')

const studentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    sub: String,
    name: String,
    email: String,
    avatar: String,
    birthDay: Date,
    initialTime: Date,
});

module.exports = mongoose.model('Student', studentSchema)
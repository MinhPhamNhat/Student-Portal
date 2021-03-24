const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    _id: String,
    name: String,
    email: String,
    avatar: String,
    role: { admin: Boolean, unit: Boolean, student: Boolean },
    sub: String,
    birthDay: Date,
    initialTime: Date,
})

module.exports = mongoose.model('User', userSchema)
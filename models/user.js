const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    _id: String,
    name: String,
    email: String,
    avatar: String,
    role: { admin: Boolean, department: Boolean, student: Boolean },
    sub: String,
    birthDay: Date,
    initialTime: Date,
    departmentID: String,
    permission: Array,
})

module.exports = mongoose.model('User', userSchema)
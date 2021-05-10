const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    _id: String,
    name: String,
    email: String,
    avatar: String,
    role: { admin: Boolean, department: Boolean, student: Boolean },
    sub: String,
    class: String,
    faculty: String,
    quote: String,
    desc: String,
    initialTime: Date,
    departmentID: String,
    permission: [{type: String, ref:"categories"}],
})

module.exports = mongoose.model('users', userSchema)
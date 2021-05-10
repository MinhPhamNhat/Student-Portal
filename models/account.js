const mongoose = require('mongoose')
const accountSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {type: String, require: true},
    password: {type: String, require: true},
    role: {
        // unit : [phong, khoa]
        admin: Boolean,
        student: Boolean,
        department: Boolean
    }
})

module.exports = mongoose.model('accounts', accountSchema)
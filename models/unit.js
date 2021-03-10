const mongoose = require('mongoose')

const unitSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    // [Phong, Khoa, Admin]
    role: String,
})

module.exports = mongoose.model('Unit', unitSchema)
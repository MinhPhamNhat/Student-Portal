const mongoose = require('mongoose')
const permissionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    objectId: String,
    permission: Array,
})

module.exports = mongoose.model('Account', permissionSchema)
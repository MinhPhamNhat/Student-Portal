const mongoose = require('mongoose')
const permissionSchema = mongoose.Schema({
    departmentID: string,
    permission: Array,
})

module.exports = mongoose.model('Account', permissionSchema)
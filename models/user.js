const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: String,
    data: {
        user: Array,
        name: String
    }
});
userSchema.statics.countData = (_id)=>{
    return mongoose.model('Student').find({sub: _id})
}
module.exports = mongoose.model('User', userSchema)
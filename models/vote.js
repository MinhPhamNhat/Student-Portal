//Like 
const mongoose = require('mongoose')

const voteSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userVote: String,
    postVote: String,
});

module.exports = mongoose.model('Vote', voteSchema)
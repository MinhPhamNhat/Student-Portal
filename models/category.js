const mongoose = require("mongoose")

const categoryShema = mongoose.Schema({
    _id: String,
    name: String,
    thumbnail: String,
});
module.exports = mongoose.model('categories', categoryShema)
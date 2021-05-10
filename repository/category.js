const mongoose = require('mongoose')
const Category = require('../models/category')
module.exports = {
    getCategory: async () =>{
        return await Category.find()
    },
}
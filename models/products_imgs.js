const mongoose = require('mongoose')

const Product_img = mongoose.Schema({
    imgs: {
        type: [String],
        default: [],
    },
    product_id: {
        type: String,
        unique: true
    }
})

module.exports = mongoose.model('ProductImg', Product_img)
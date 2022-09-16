const mongoose = require('mongoose')

const Product = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
        required: false,
    },
    images: {
        type: [String],
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    productId: {
        type: String,
        unique: true,
    },
})

module.exports = mongoose.model('Product', Product)
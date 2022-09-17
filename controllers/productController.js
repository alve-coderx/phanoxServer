const Product = require('../models/product')
const ProductImg = require('../models/products_imgs')
const ObjectId = require('mongodb').ObjectId;
const fetchProducts = async (req, res) => {
    try {
        const products = await Product.find()
        res.status(200).json(products)
    } catch (error) {
        console.log(error)
    }
}

const getProduct = async (req, res) => {
    try {
        const id = req.params.id

        const query = { _id: ObjectId(id) };

        const product = await Product.findOne(query)

        res.status(200).json({ product })

    } catch (error) {
        console.log(error)
    }
}

const postProduct = async (req, res) => {
    try {

        const { title, details, price, discount, rating, productId } = req.body;
        console.log(req.body)
        // console.log(req.files)

        if ( !req.body.title || !req.body.details || !req.body.price || !req.body.discount || !req.body.rating || !req.body.productId ) {
            res.status(400).json({ message: 'you should fill required feilds' })
            return
        } 

        if ( !req.files?.length ) {
            res.status(400).json({ message: 'you should add images' })
            return
        }

        // Create Images
        const images = []

        for(let i = 0; i < req.files.length; i++) {
            const path = `http://${req.hostname}:5000/uploads/${req.files[i].filename}`
            images.push(path)
        }

        // Create New Product
        const newProduct = await Product.create({
            title,
            details,
            price,
            discount,
            rating,
            productId,
            images
        })
        
        res.status(200).json(newProduct)
    } catch (error) {
        console.log(error)
    }
}

const delProduct = async (req, res) => {
    const _id = req.params.id
    console.log(_id)
    if ( _id ) {
        const del = await Product.findByIdAndDelete(_id)
    }
    res.json({message: 'deleted successfully'})
}
module.exports = {fetchProducts, postProduct, getProduct, delProduct}
const Pettern = require('../models/pettern')
const ProductImg = require('../models/products_imgs')
const ObjectId = require('mongodb').ObjectId;
const fetchPetterns = async (req, res) => {
    try {
        const petterns = await Pettern.find()
        res.status(200).json(petterns)
    } catch (error) {
        console.log(error)
    }
}

const getPettern = async (req, res) => {
    try {
        const id = req.params.id

        const query = { _id: ObjectId(id) };

        const pettern = await Pettern.findOne(query)

        res.status(200).json({ pettern })

    } catch (error) {
        console.log(error)
    }
}

const postPettern = async (req, res) => {
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
        const newProduct = await Pettern.create({
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

const delPettern = async (req, res) => {
    const _id = req.params.id
    console.log(_id)
    if ( _id ) {
        const del = await Pettern.findByIdAndDelete(_id)
    }
    res.json({message: 'deleted successfully'})
}
module.exports = {fetchPetterns, postPettern, getPettern, delPettern}
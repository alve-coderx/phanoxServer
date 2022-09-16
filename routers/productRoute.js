const express = require('express')
const router = express.Router()
const { fetchProducts, postProduct, getProduct, delProduct } = require('../controllers/productController')
const multer = require('multer')
const {v4} = require('uuid')

const DIR = 'uploads/'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

router.post('/', upload.array('productImg', 10), postProduct)

router.route('/').get(fetchProducts)
router.route('/:id').get(getProduct).delete(delProduct)

module.exports = router
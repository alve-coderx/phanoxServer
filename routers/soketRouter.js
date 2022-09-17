const express = require('express')
const router = express.Router()
const { getSoket } = require('../controllers/soketController')

router.route('/').get(getSoket)


module.exports = router

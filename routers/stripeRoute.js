const express = require('express')
const router = express.Router()
const { handler } = require('../srtipe')

router.route('/').post(handler)

module.exports = router
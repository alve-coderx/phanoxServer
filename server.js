require('dotenv').config()
const express = require('express')
const app = express()
module.exports = { app }
const mongoose = require('mongoose')
const cors = require('cors')
const port = process.env.PORT || 5000
const { server } = require('./socket.io')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded( { extended: false } ))
app.use(cors())
express.json()
app.use('/uploads', express.static('uploads'))

// Routers
app.use('/products', require('./routers/productRoute'))
app.use('/create-checkout-session', require('./routers/stripeRoute'))

const mongodb_uri = process.env.MONGODB_URI

mongoose.connect(mongodb_uri).then(() => {
    try {
        app.listen(port, () => {
            console.log(`server is running on port: ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}).catch(error => {
    console.log(error)
})
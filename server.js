require('dotenv').config()
const express = require('express')
const app = express()
const http = require("http");
module.exports = { app }
const mongoose = require('mongoose')
const cors = require('cors')
const server = http.createServer(app);
const port = process.env.PORT || 5000
const bodyParser = require('body-parser')
const { Server } = require("socket.io");

app.use(bodyParser.json())
app.use(bodyParser.urlencoded( { extended: false } ))
app.use(cors())
express.json()
app.use('/uploads', express.static('uploads'))

// Routers
app.use('/products', require('./routers/productRoute'))
app.use('/petterns', require('./routers/petternRoute'))
app.use('/create-checkout-session', require('./routers/stripeRoute'))

const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
  
  
  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
  // audio call
    socket.emit('me',socket.id)
  
    socket.on('join_room',(data)=>{
        socket.join(data);
        console.log(`user id  :  ${socket.id} joined room : ${data}`)
  
    });
    socket.on("send_message",(data)=>{
        console.log(data)
        socket.to(data.room).emit('receive_message',data);
  
    });
 
  });



const mongodb_uri = process.env.MONGODB_URI


mongoose.connect(mongodb_uri).then(() => {
    try {
        server.listen(port, () => {
            console.log(`server is running on port: ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}).catch(error => {
    console.log(error)
})


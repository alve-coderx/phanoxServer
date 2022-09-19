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
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
const socketio = require('socket.io');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded( { extended: false } ))
app.use(cors())
express.json()
app.use('/uploads', express.static('uploads'))

// Routers
app.use('/products', require('./routers/productRoute'))
app.use('/petterns', require('./routers/petternRoute'))
app.use('/create-checkout-session', require('./routers/stripeRoute'))
app.use(require('./routers/soketRouter'))


const io = socketio(server);
  
  
  io.on('connect', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
      console.log(room)
      const { error, user } = addUser({ id: socket.id, name, room });
  
      if(error) return callback(error);
  
      socket.join(user.room);
  
      socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
      socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
  
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
  
      callback();
    });
  
    socket.on('sendMessage', (message, callback) => {
      const user = getUser(socket.id);
      console.log(user)
      io.to(user.room).emit('message', { user: user.name, text: message });
  
      callback();
    });
  
    socket.on('disconnect', () => {
      const user = removeUser(socket.id);
  
      if(user) {
        io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
      }
    })
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


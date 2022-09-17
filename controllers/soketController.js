const {app} = require('../server')
const { Server } = require("socket.io");
const http = require("http");
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
  
  
  const getSoket = async (req, res) => {
    try {
       
      io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`);
      
        socket.on("join_room", (data) => {
          socket.join(data);
          console.log(`User with ID: ${socket.id} joined room: ${data}`);
        });
      
        socket.on("send_message", (data) => {
          socket.to(data.room).emit("receive_message", data);
        });
      
        socket.on("disconnect", () => {
          console.log("User Disconnected", socket.id);
        });
      });
      res.send('fafs')

    } catch (error) {
        console.log(error)
    }
}

module.exports = {getSoket}
  
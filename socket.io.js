const {app} = require('./server')
const server = require('http').createServer(app)
const {Server} = require('socket.io')

const io = new Server(server, {
    cors: {
        origin: '*',
        method: ['GET', 'POST']
    }
})

module.exports = { server, io }
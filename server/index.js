const express = require('express')
const socketio = require('socket.io')
const http = require('http')

const PORT = process.env.PORT || 5000

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(require('./router'))

io.on('connection', (socket) => {
  console.log(socket);
  console.log('user signin');
  io.on('disconnect', () => {
    console.log('user signout');
  })
})


server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
})
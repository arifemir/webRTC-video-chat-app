const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const morgan = require('morgan')
const cors = require('cors');
const PORT = process.env.PORT || 5000

const router = require('./router')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(cors())
app.use(morgan('dev'))
app.use(router)

io.on('connection', (socket) => {
  socket.on('join', ({name, room}, callback) => {
    console.log(name, room)

    let error = true
    callback({error})
  })
  io.on('disconnect', () => {
    console.log('user signout')
  })
})

server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`)
})
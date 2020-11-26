const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const morgan = require('morgan')
const cors = require('cors');
const PORT = process.env.PORT || 5000

const router = require('./router');
const { addUser, getUser, removeUser, getUsersInRoom } = require('./users');

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(cors())
app.use(morgan('dev'))
app.use('/api', router)

io.on('connection', (socket) => {
  console.log('user signin')
  socket.on('join', async ({name, room}, callback) => {
    let error = false
    let user = false
    try {
      user = await addUser({id: socket.id, name, room})
      console.log(user);
    } catch (e) {
      error = e
    }
    if(error) return callback({error})

    socket.emit('message', {user: 'admin', text: `${user.name}, welcome to the room ${user.room}`})
    socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name}, has joined!`})
    socket.join(user.room)
    callback()
  })

  socket.on('sendMessage', async (message, callback) => {
    let user = false
    let error = false
    try {
      user = await getUser(socket.id)
    } catch (e) {
      error = e
    }
    if(error) return callback(error)

    io.to(user.room).emit('message', {user: user.name, text: message})
    callback()
  })

  io.on('disconnect', () => {
    console.log('user signout')
  })
})

server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`)
})
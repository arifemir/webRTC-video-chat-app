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
  socket.on('join', async ({name, room, id}, callback) => {
    let error = false
    let user = false
    try {
      user = await addUser({id: socket.id, name, room, peerId: id})
      console.log(user);
    } catch (e) {
      error = e
    }
    if(error) return callback({error})

    socket.join(user.room);
    socket.to(room).broadcast.emit('user-connected', id)
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
    io.to(user.room).emit('roomData', { room: user.room, users: await getUsersInRoom(user.room) });

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
    
    callback();
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

  io.on('disconnect', async () => {
    let user = false
    let error = false

    try {
      user = await removeUser(socket.id)
    } catch (e) {
      error = e
    }
    if(error) return callback(error)

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: await getUsersInRoom(user.room)});
    }
  })
})

server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`)
})
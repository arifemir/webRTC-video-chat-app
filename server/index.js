const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const morgan = require('morgan')
const cors = require('cors')
const PORT = process.env.PORT || 5000

const router = require('./router')
const { addUser, getUser, removeUser, getUsersInRoom } = require('./users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(cors())
app.use(morgan('dev'))
app.use('/api', router)

const usersForVideo = {};
const socketToRoom = {};

io.on('connection', (socket) => {
	socket.on('join-chat', async ({ name, room }, callback) => {
		let error = false
		let user = false
		try {
			user = await addUser({ id: socket.id, name, room, peerId: id })
		} catch (e) {
			error = e
		}
		if (error) return callback({ error })

		socket.join(room)
		socket.emit('message', { user: 'admin', text: `${name}, welcome to room ${room}.` })
		socket.broadcast.to(room).emit('message', { user: 'admin', text: `${name} has joined!` })
		io.to(room).emit('roomData', { room: room, users: await getUsersInRoom(room) })
		callback()
	})
  socket.on("join-video", room => {
    if (usersForVideo[room]) {
        const length = usersForVideo[room].length;
        if (length === 4) {
            socket.emit("room full");
            return;
        }
        usersForVideo[room].push(socket.id);
    } else {
      usersForVideo[room] = [socket.id];
    }
    socketToRoom[socket.id] = room;
    const usersInThisRoom = usersForVideo[room].filter(id => id !== socket.id);

    socket.emit("all users", usersInThisRoom);
});
  socket.on("sending signal", payload => {
    io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
  });

  socket.on("returning signal", payload => {
      io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
  });

	socket.on('sendMessage', async (message, callback) => {
		let user = false
		let error = false
		try {
			user = await getUser(socket.id)
		} catch (e) {
			error = e
		}
		if (error) return callback(error)

		io.to(user.room).emit('message', { user: user.name, text: message })
		callback()
	})

	io.on('disconnect', async () => {
    //video
    const room = socketToRoom[socket.id];
    let isRoomHave = usersForVideo[room];
    if (isRoomHave) {
        room = room.filter(id => id !== socket.id);
        usersForVideo[room] = room;
    }

    //chat
		let user = false
		let error = false

		try {
			user = await removeUser(socket.id)
		} catch (e) {
			error = e
		}
		if (error) return callback(error)

		if (user) {
			io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` })
			io.to(user.room).emit('roomData', { room: user.room, users: await getUsersInRoom(user.room) })
		}
	})
})

server.listen(PORT, () => {
	console.log(`server started on port: ${PORT}`)
})

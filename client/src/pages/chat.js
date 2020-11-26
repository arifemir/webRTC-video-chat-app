import React, {useState, useEffect} from 'react'
import io from 'socket.io-client'
import queryString from 'query-string'

let socket

const Chat = ({location}) => {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const ENDPOINT = '/'

  useEffect(() => {
    const {name, room} = queryString.parse(location.search)

    socket = io(ENDPOINT)

    setName(name)
    setRoom(room)

    socket.emit('join', {name, room}, (err) => {
      if(err) console.log(err.error)
    })

    return () => {
      socket.emit('disconnect')
      socket.off()
    }

  }, [ENDPOINT, location.search])

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message])
      console.log(message);
    })
  }, [messages])

  useEffect(() => {
    socket.emit('sendMessage', {message}, (err) => {
      if(err) console.log(err.error)
    })
  }, [messages])

  return (
    <div>
      chatPage
    </div>
  )
}

export default Chat

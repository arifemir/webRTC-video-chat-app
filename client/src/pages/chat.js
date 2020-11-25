import React, {useState, useEffect} from 'react'
import io from 'socket.io-client'
import queryString from 'query-string'

let socket

const Chat = ({location}) => {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const ENDPOINT = '/'

  useEffect(() => {
    const {name, room} = queryString.parse(location.search)

    socket = io(ENDPOINT)

    setName(name)
    setRoom(room)

    console.log(socket);
  }, [])

  return (
    <div>
      chatPage
    </div>
  )
}

export default Chat

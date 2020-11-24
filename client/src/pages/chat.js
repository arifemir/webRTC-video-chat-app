import React, {useState, useEffect} from 'react'
import io from 'socket.io-client'
import queryString from 'query-string'

const chat = () => {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')

  useEffect(({location}) => {
    const {name, room} = queryString.parse(location.search)
    setName(name)
    setRoom(room)
  }, [])

  return (
    <div>
      chatPage
    </div>
  )
}

export default chat

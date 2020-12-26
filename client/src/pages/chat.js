import React, {useState, useEffect} from 'react'
import io from 'socket.io-client'
import queryString from 'query-string'

import InfoBar from '../components/InfoBar'
import Messages from '../components/Messages'
import Input from '../components/Input'
import TextContainer from '../components/TextContainer'

import './Chat.css';

let socket

const Chat = ({location}) => {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [users, setUsers] = useState('');
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
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
    });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }
  return (
    <div className="outerContainer">
      <div className='container-video'>
        <div className="video">
          
        </div>
        <div className="video">

        </div>
        <div className="video">

        </div>
      </div>
      <div className="container-mesagges-text">
        <div className="container-messages">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
        </div>
        <TextContainer users={users}/>
      </div>
    </div>
  )
}

export default Chat

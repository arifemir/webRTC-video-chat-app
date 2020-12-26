import React, {useState, useEffect, useRef} from 'react'
import io from 'socket.io-client'
import queryString from 'query-string'
import Peer from 'peerjs'
import InfoBar from '../components/InfoBar'
import Messages from '../components/Messages'
import Input from '../components/Input'
import TextContainer from '../components/TextContainer'
import Video from '../components/video'
import './Chat.css';

let socket

const Chat = ({location}) => {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [myVideo, setMyVideo] = useState(null);
  const ENDPOINT = '/'

  useEffect(() => {
    const {name, room} = queryString.parse(location.search)
    socket = io(ENDPOINT)

    setName(name)
    setRoom(room)

    const myPeer = new Peer(undefined, {
      host: '/',
      port: '3001'
    })

    myPeer.on('open', id => {
      socket.emit('join', {name, room, id}, (err) => {
        if(err) console.log(err.error)
      })
    })

    return () => {
      socket.emit('disconnect')
      socket.off()
    }

  }, [ENDPOINT, location.search])

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(stream => {
      setMyVideo(<Video muted id={name} />)
      document.getElementById('video' + name).srcObject = stream
    })
    console.log('sa');
  }, [])

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
        {myVideo}
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

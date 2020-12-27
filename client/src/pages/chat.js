import React, {useState, useEffect, useRef} from 'react'
import socket from '../configs/socketConfig'
import queryString from 'query-string'
import Peer from 'peerjs'
import InfoBar from '../components/InfoBar'
import Messages from '../components/Messages'
import Input from '../components/Input'
import TextContainer from '../components/TextContainer'
import Video from '../components/video'
import './Chat.css';


const Chat = ({location}) => {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [peers, setPeers] = useState({})
  const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001'
  })

  useEffect(() => {
    const {name, room} = queryString.parse(location.search)

    setName(name)
    setRoom(room)

    const myVideo = document.createElement('video')
    myVideo.muted = true

    myPeer.on('open', id => {
      socket.emit('join', {name, room, id}, (err) => {
        if(err) console.log(err.error)

        navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        }).then(stream => {
          addVideoStream(myVideo, stream)

          myPeer.on('call', call => {
            call.answer(stream)
            const video = document.createElement('video')
            call.on('stream', userVideoStream => {
              addVideoStream(video, userVideoStream)
            })
          })
        
          socket.on('user-connected', userId => {
            connectToNewUser(userId, stream)
          })
        })
      })
    })

    return () => {
      socket.emit('disconnect')
      socket.off()
    }

  }, [location.search])

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

  function addVideoStream(video, stream) {
    const videoGrid = document.querySelector('div.container-video');
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    console.log(videoGrid);
    videoGrid.append(video)
  }

  function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
      video.remove()
    })
  
    setPeers(prevPeers => prevPeers[userId] = call)
  }

  return (
    <div className="outerContainer">
      <div className='container-video'>
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

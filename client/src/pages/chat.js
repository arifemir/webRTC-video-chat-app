import React, { useState, useEffect, useRef } from 'react'
import socket from '../configs/socketConfig'
import Peer from 'simple-peer'
import queryString from 'query-string'
import InfoBar from '../components/InfoBar'
import Messages from '../components/Messages'
import Input from '../components/Input'
import TextContainer from '../components/TextContainer'
import Video from '../components/video'
import { videoDimensions } from '../constants/videoConstraints'
import './Chat.css'

const Chat = ({ location }) => {
	const [name, setName] = useState('')
	const [room, setRoom] = useState('')
	const [users, setUsers] = useState('')
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState([])
	const [peers, setPeers] = useState([])
	const socketRef = useRef()
	const userVideo = useRef()
	const peersRef = useRef([])

	useEffect(() => {
		const { name, room } = queryString.parse(location.search)

		setName(name)
		setRoom(room)

		socket.emit('join-chat', { name, room }, (err) => {
			if (err) console.log(err.error)
		})
	}, [location.search])

	useEffect(() => {
		socket.on('message', (message) => {
			setMessages((messages) => [...messages, message])
		})

		socket.on('roomData', ({ users }) => {
			setUsers(users)
		})
	}, [])

	useEffect(() => {
		socketRef.current = socket.connect('/')
		navigator.mediaDevices.getUserMedia({ video: videoDimensions, audio: true }).then((stream) => {
			userVideo.current.srcObject = stream
			socketRef.current.emit('join-video', room)
			socketRef.current.on('all users', (users) => {
				const peers = []
				users.forEach((userID) => {
					const peer = createPeer(userID, socketRef.current.id, stream)
					peersRef.current.push({
						peerID: userID,
						peer,
					})
					peers.push(peer)
				})
				setPeers(peers)
			})

			socketRef.current.on('user joined', (payload) => {
				const peer = addPeer(payload.signal, payload.callerID, stream)
				peersRef.current.push({
					peerID: payload.callerID,
					peer,
				})

				setPeers((users) => [...users, peer])
			})

			socketRef.current.on('receiving returned signal', (payload) => {
				const item = peersRef.current.find((p) => p.peerID === payload.id)
				item.peer.signal(payload.signal)
			})
		})
	}, [])

	function createPeer(userToSignal, callerID, stream) {
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream,
		})

		peer.on('signal', (signal) => {
			socketRef.current.emit('sending signal', { userToSignal, callerID, signal })
		})

		return peer
	}

	function addPeer(incomingSignal, callerID, stream) {
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream,
		})

		peer.on('signal', (signal) => {
			socketRef.current.emit('returning signal', { signal, callerID })
		})

		peer.signal(incomingSignal)

		return peer
	}
	const sendMessage = (event) => {
		event.preventDefault()

		if (message) {
			socket.emit('sendMessage', message, () => setMessage(''))
		}
	}

	return (
		<div className='outerContainer'>
			<div className='container-video'>
				<video muted ref={userVideo} autoPlay playsInline />
				{peers.map((peer, index) => {
					return <Video key={index} peer={peer} />
				})}
			</div>
			<div className='container-mesagges-text'>
				<div className='container-messages'>
					<InfoBar room={room} />
					<Messages messages={messages} name={name} />
					<Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
				</div>
				<TextContainer users={users} />
			</div>
		</div>
	)
}

export default Chat

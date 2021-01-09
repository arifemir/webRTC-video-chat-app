import React, { useRef, useEffect } from 'react'

const Video = (props) => {
	const ref = useRef()

	useEffect(() => {
		props.peer.on('stream', (stream) => {
			ref.current.srcObject = stream
		})
	}, [])

	return <video playsInline autoPlay ref={ref} {...props} />
}

export default Video

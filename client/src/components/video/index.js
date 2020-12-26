import React, {useRef, useEffect} from 'react'

import './Video.css'

const Video = ({id, muted}) => {
  return (
    <div className='video' >
      <video id={'video' + id} muted={muted} autoPlay />
    </div>
  )
}
 
export default Video
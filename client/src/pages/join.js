import React, {useState} from 'react'
import { Link } from 'react-router-dom'


const Join = () => {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  return (
    <div className='join-container'>
      <div className="join-inner-container">
        <h1 className="header"></h1>
        <div><input placeholder='Name' type="text" className="join-input" onChange={(e) => setName(e.target.value)} value={name}/></div>
        <div><input placeholder='Room' type="text" className="join-input" onChange={(e) => setRoom(e.target.value)} value={room}/></div>
        <Link onClick={e => (!name || !room) && e.preventDefault()} to={`/chat?name=${name}&room=${room}`}>
          <button className="button" type='submit'>Sign in</button>
        </Link>
      </div>
    </div>
  )
}

export default Join

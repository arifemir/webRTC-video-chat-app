import React, { useEffect, useRef } from 'react';

import Message from './Message';

import './Messages.css';

const Messages = ({ messages, name }) => {
  let messagesEndRef = useRef()
  
  useEffect(() => {
    scrollToBottom();
  }, [])

  useEffect(() => {
    scrollToBottom();
  },[messages])

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="messages">
      {messages.map((message, i) => <div key={i} ref={(messages.length - 1 === i) ? messagesEndRef : null}><Message message={message} name={name}/></div>)}
      <div ref={messagesEndRef} />
    </div>
  )
};

export default Messages;
import React from 'react'
import Profile from '../Components/Profile'
import Messages from '../Components/Messages'
import ChatForm from '../Components/ChatForm'

const Chat = () => {
  return (
    <div style={{display: "flex", margin: "auto", maxWidth: "1480px"}}>
      <Profile/>
      <Messages/>
    </div>
  )
}

export default Chat
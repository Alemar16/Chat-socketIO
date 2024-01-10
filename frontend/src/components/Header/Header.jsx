import React from 'react'

function Header() {
  return (
    <div className="text-center">
          <img
            src="/icons8-chat-100.png"
            alt="Logo-Chat"
            className="w-20 h-20 mx-auto mb-1"
          />
          <h1 className="text-3xl font-bold mb-5">Chat Socket.io</h1>
        </div>
  )
}

export default Header
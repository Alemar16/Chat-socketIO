import io from 'socket.io-client'
import { useState } from 'react'

const socket = io('/') //para enviar al backend

function App() {
  const [message, setMessage] = useState('')

  const handleSbmit = (e) => {
    e.preventDefault()
    //console.log(message)
    socket.emit( 'message', message)
  }

  return (
    <div>

      <form onSubmit={handleSbmit}>

        <input type="text"  placeholder='write your message ...'
          onChange = {(e) => setMessage(e.target.value)}
        />
        <button>send</button>
      </form>

    </div>
  )
}

export default App
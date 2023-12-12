import io from "socket.io-client";
import { useState, useEffect } from "react";

const socket = io("/"); //para enviar al backend

function App() {
  const [message, setMessage] = useState(""); //para escribir el mensaje
  const [messages, setMessages] = useState([]); //para mostrar los mensajes(array de mensajes)
  const handleSbmit = (e) => {
    //para enviar el mensaje al backend
    e.preventDefault();
    //console.log(message)
    socket.emit("message", message);
  };

  useEffect(() => {
    //se mantendrá escuchando el evento message del backend para mostrar los mensajes en tiempo real
    socket.on("message", (message) => {
      console.log(message);
      setMessages([...messages, message]);
    });
  });

  return (
    <div>
      <form onSubmit={handleSbmit}>
        <input
          type="text"
          placeholder="write your message ..."
          onChange={(e) => setMessage(e.target.value)}
        />
        <button>send</button>
      </form>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

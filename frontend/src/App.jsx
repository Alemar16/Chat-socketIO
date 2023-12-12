import io from "socket.io-client";
import { useState, useEffect } from "react";

const socket = io("/"); //para enviar al backend

function App() {
  const [message, setMessage] = useState(""); //para escribir el mensaje
  const [messages, setMessages] = useState([]); //para mostrar los mensajes(array de mensajes)

  //para enviar el mensaje al backend
  const handleSbmit = (e) => {
    e.preventDefault();
    //console.log(message)
    const newMessage = {//para mostrar el mensaje en el mismo chat del que envia el id
      body: message,
      from: "Me",
    }
    setMessages([...messages, newMessage]);//para mostrar el mensaje en el mismo chat del que envia
    socket.emit("message", message);//para mandar el mensaje
  };


  //se mantendrá escuchando el evento message del backend para mostrar los mensajes en tiempo real
  useEffect(() => {
    socket.on("message", reciveMessage)//recivo el mensaje y lo muestro
      //console.log(message); 
    return () => {
      socket.off("message", reciveMessage);//muestro el mensaje solo una vez y lo actualizo
    }
  }, []);

  const reciveMessage = (message)=> 
  setMessages(state => [...state, message])
    
  

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
          <li key={index}>
            {message.from}:{message.body}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

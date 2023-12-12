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
    <div className="h-screen bg-zinc-900 text-white flex items-center justify-center">
      <form onSubmit={handleSbmit} className="bg-zinc-800 p-10 rounded">
        <h1 className="text-3xl font-bold mb-5">Chat React</h1>
        <input
          type="text"
          placeholder="write your message ..."
          className="border-2 border-zinc-600 p-2 w-full rounded text-black"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button>send</button>
      <ul>
        {messages.map((message, index) => (
          <li key={index} className={
            `my-2 p-2 table text-sm rounded-md ${
              message.from === "Me" ? "bg-sky-900 ml-auto" : "bg-sky-600"
            }`
          }>
            <span className="font-bold text-xs text-slate-900 block">{message.from}</span> <span className=" text-md font-bold shadow">{message.body}</span>
            </li>
        ))}
      </ul>
      </form>
    </div>
  );
}

export default App;

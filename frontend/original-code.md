# Original Code
## Frontend
### App.jsx
```js
 import io from "socket.io-client";
 import { useState, useEffect } from "react";
 import backgroundImage from "./assets/image-background.jpg";

 const socket = io("/"); //para enviar al backend
 function App() {
   const [message, setMessage] = useState(""); //para escribir el mensaje
   const [messages, setMessages] = useState([]); //para mostrar los mensajes(array de mensajes)

   //para enviar el mensaje al backend
   const handleSbmit = (e) => {
     e.preventDefault();
     //console.log(message)
     const newMessage = {
       //para mostrar el mensaje en el mismo chat del que envia el id
       body: message,
       from: "Me",
     };
     setMessages([...messages, newMessage]); //para mostrar el mensaje en el mismo chat del que envia
     socket.emit("message", message); //para mandar el mensaje

   };

   //se mantendrá escuchando el evento message del backend para mostrar los mensajes en tiempo real
   useEffect(() => {
     socket.on("message", reciveMessage); //recivo el mensaje y lo muestro
     //console.log(message);
     return () => {
       socket.off("message", reciveMessage); //muestro el mensaje solo una vez y lo actualizo
     };
   }, []);
  const reciveMessage = (message) =>
     setMessages((state) => [...state, message]);
  return (
     <div
       className="h-screen bg-zinc-200 text-white flex items-center justify-center"
       style={{
         backgroundImage: `url(${backgroundImage})`,
         backgroundSize: "cover",
         backgroundPosition: "center",
       }}
     >
       <form
         onSubmit={handleSbmit}
         className="p-10 rounded "
         style={{
           background: "rgba(161, 175, 192, 0.55)", // Ajusta el color y la opacidad según tus preferencias
         }}
       >
         <div>
           <img src="/icons8-chat-100.png" alt="" />
           <h1 className="text-3xl font-bold mb-5">Chat Socket.io</h1>
         </div>

         <div className="mb-5 flex gap-3">
           <input
             type="text"
             placeholder="write your message ..."
             className="border-2 border-zinc-600 p-2 w-full rounded text-black"
             onChange={(e) => setMessage(e.target.value)}
           />
           <button className="btn hover:bg-blue-800">Send</button>
         </div>

         <ul className="max-h-60 p-2 overflow-y-auto">
           {messages.length > 0 ? (
             messages.map((message, index) => (
               <li
                 key={index}
                 className={`my-2 p-2 table text-sm rounded-md ${
                   message.from === "Me"
                     ? "bg-purple-900 ml-auto"
                     : "bg-blue-400"
                 }`}
               >
                 <span className="text-xs text-slate-900 block">
                   {message.from}
                 </span>{" "}
                 <span className="text-md font-bold shadow">{message.body}</span>
               </li>
             ))
           ) : (
             <li className="p-2 text-sm text-gray-500 flex items-center justify-center">
               No messages yet.
             </li>
           )}
         </ul>
       </form>
     </div>
   );
 }

export default App;
```


## Server
### index.js
```js
import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

io.on('connection', socket => {
    console.log(socket.id);

    socket.on('message',(body) =>{//escuchar el mensaje
        console.log(body);
        socket.broadcast.emit('message', {
            body,
            from: socket.id.slice(6)//para mostrar solo el id del cliente que envia
        });//reponde el mensaje
    })
});

server.listen(3000, () => {
    console.log('Server on port 3000');
});

```
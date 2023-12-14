import io from "socket.io-client";
import { useState, useEffect } from "react";
import FormComponent from "./components/FormComponent/FormComponent";
import ListMessageComponent from "./components/ListMessageComponent/ListMessageComponent";
import backgroundImage from "./assets/image-background.jpg";

const socket = io("/");

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("message", reciveMessage);
    return () => {
      socket.off("message", reciveMessage);
    };
  }, []);

  const reciveMessage = (message) =>
    setMessages((state) => [message, ...state]); 

  const handleSbmit = (message) => {
    const newMessage = {
      body: message,
      from: "Me",
    };
    setMessages([newMessage, ...messages]);
    socket.emit("message", message);
  };

  return (
    <div
      className="h-screen bg-zinc-200 text-white flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="backdrop-saturate-125 bg-white/30 rounded-2xl">
        <FormComponent onSubmit={handleSbmit} />
        <ListMessageComponent messages={messages} />
      </div>
    </div>
  );
}

export default App;

// import io from "socket.io-client";
// import { useState, useEffect } from "react";
// import backgroundImage from "./assets/image-background.jpg";

// const socket = io("/"); //para enviar al backend

// function App() {
//   const [message, setMessage] = useState(""); //para escribir el mensaje
//   const [messages, setMessages] = useState([]); //para mostrar los mensajes(array de mensajes)

//   //para enviar el mensaje al backend
//   const handleSbmit = (e) => {
//     e.preventDefault();
//     //console.log(message)
//     const newMessage = {
//       //para mostrar el mensaje en el mismo chat del que envia el id
//       body: message,
//       from: "Me",
//     };
//     setMessages([...messages, newMessage]); //para mostrar el mensaje en el mismo chat del que envia
//     socket.emit("message", message); //para mandar el mensaje

//   };

//   //se mantendrá escuchando el evento message del backend para mostrar los mensajes en tiempo real
//   useEffect(() => {
//     socket.on("message", reciveMessage); //recivo el mensaje y lo muestro
//     //console.log(message);
//     return () => {
//       socket.off("message", reciveMessage); //muestro el mensaje solo una vez y lo actualizo
//     };
//   }, []);

//   const reciveMessage = (message) =>
//     setMessages((state) => [...state, message]);

//   return (
//     <div
//       className="h-screen bg-zinc-200 text-white flex items-center justify-center"
//       style={{
//         backgroundImage: `url(${backgroundImage})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <form
//         onSubmit={handleSbmit}
//         className="p-10 rounded "
//         style={{
//           background: "rgba(161, 175, 192, 0.55)", // Ajusta el color y la opacidad según tus preferencias
//         }}
//       >
//         <div>
//           <img src="/icons8-chat-100.png" alt="" />
//           <h1 className="text-3xl font-bold mb-5">Chat Socket.io</h1>
//         </div>

//         <div className="mb-5 flex gap-3">
//           <input
//             type="text"
//             placeholder="write your message ..."
//             className="border-2 border-zinc-600 p-2 w-full rounded text-black"
//             onChange={(e) => setMessage(e.target.value)}
//           />
//           <button className="btn hover:bg-blue-800">Send</button>
//         </div>

//         <ul className="max-h-60 p-2 overflow-y-auto">
//           {messages.length > 0 ? (
//             messages.map((message, index) => (
//               <li
//                 key={index}
//                 className={`my-2 p-2 table text-sm rounded-md ${
//                   message.from === "Me"
//                     ? "bg-purple-900 ml-auto"
//                     : "bg-blue-400"
//                 }`}
//               >
//                 <span className="text-xs text-slate-900 block">
//                   {message.from}
//                 </span>{" "}
//                 <span className="text-md font-bold shadow">{message.body}</span>
//               </li>
//             ))
//           ) : (
//             <li className="p-2 text-sm text-gray-500 flex items-center justify-center">
//               No messages yet.
//             </li>
//           )}
//         </ul>
//       </form>
//     </div>
//   );
// }

// export default App;

import io from "socket.io-client";
import { useState, useEffect } from "react";
import FormComponent from "./components/FormComponent/FormComponent";
import ListMessageComponent from "./components/ListMessageComponent/ListMessageComponent";

const socket = io("/");

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("message", reciveMessage);
    return () => {
      socket.off("message", reciveMessage);
    };
  }, []);

  const reciveMessage = (message) => {
    const newMessage = {
      body: message.body,
      from: message.from,
      timestamp: new Date().toISOString(),
    };
  
    setMessages((state) => [newMessage, ...state]);
  };
  
    const handleSbmit = (message) => {
      const newMessage = {
        body: message,
        from: "Me",
        timestamp: new Date().toISOString(),
      };
      setMessages([newMessage, ...messages]);
      socket.emit("message", message);
    };
    

  return (
    <div
      className="h-screen bg-[url('./assets/image-background.jpg')] bg-cover bg-center text-white flex flex-col items-center justify-center"
    >
      <div className="backdrop-saturate-125 bg-white/20 rounded-2xl shadow-lg shadow-slate-900/60 ">
        <FormComponent onSubmit={handleSbmit} />
        <ListMessageComponent messages={messages} />
      </div>
    </div>
  );
}

export default App;



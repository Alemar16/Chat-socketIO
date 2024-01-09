import io from "socket.io-client";
import { useState, useEffect } from "react";
import FormComponent from "./components/FormComponent/FormComponent";
import ListMessageComponent from "./components/ListMessageComponent/ListMessageComponent";
import LoginComponent from "./components/LoginComponent/LoginComponent";
import Header from "./components/Header/Header";
import { ButtonLogout } from "./components/Buttons/ButtonLogout";


const socket = io("/");

function App({onLogout}) {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
 

  useEffect(() => {
    socket.on("message", reciveMessage);
    return () => {
      socket.off("message", reciveMessage);
    };
  }, []);

  const handleLogin = (username) => {
    setUsername(username);
    socket.emit("login", username);
  };

  const handleLogout = () => {
    socket.emit("logout");
    setUsername("");
  };

  const handleLoginAsAnonymous = () => {
    const anonymousUsername = `Anonymous_${Math.floor(Math.random() * 1000)}`;
    setUsername(anonymousUsername);
    socket.emit("login", anonymousUsername);
  };

  const reciveMessage = (message) => {
    const newMessage = {
      body: message.body,
      from: message.from,
      timestamp: new Date().toISOString(),
    };

    setMessages((state) => [newMessage, ...state]);
  };

  const handleSubmit = (message) => {
    const newMessage = {
      body: message,
      from: "Me",
      timestamp: new Date().toISOString(),
    };
    setMessages([newMessage, ...messages]);
    socket.emit("message", message);
  };

  return (
    <>
      {username ? (
        <div className="backdrop-saturate-125 bg-white/20 rounded-2xl shadow-lg shadow-slate-900/60 p-2">
          <div>
          <div className="relative">
        <Header />

        <div className="absolute top-0 right-0 m-1">
          <ButtonLogout onLogout={handleLogout} />
        </div>
      </div>
            <FormComponent
              onSubmit={handleSubmit}
              username={username}
              
            />
          </div>
          <div className="backdrop-saturate-125 bg-white/20 rounded-2xl shadow-lg shadow-slate-900/60">
            <ListMessageComponent messages={messages} />
          </div>
        </div>
      ) : (
        <div className="backdrop-saturate-125 bg-white/20 rounded-2xl shadow-lg shadow-slate-900/60 mt-20">
          <LoginComponent
            onLogin={handleLogin}
            onLoginAsAnonymous={handleLoginAsAnonymous}
          />
        </div>
      )}
    </>
  );
}

export default App;

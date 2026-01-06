import io from "socket.io-client";
import { useState, useEffect } from "react";
import FormComponent from "./components/FormComponent/FormComponent";
import ListMessageComponent from "./components/ListMessageComponent/ListMessageComponent";
import LoginComponent from "./components/LoginComponent/LoginComponent";
import Header from "./components/Header/Header";
import { ButtonLogout } from "./components/Buttons/ButtonLogout";
import { ButtonShare } from "./components/Buttons/ButtonShare";
import Footer from "./components/Footer/Footer";
import TermsAndConditions from "./components/TermsAndConditions/TermsAndConditions";

const socket = io("/");

function App() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    // Room Logic
    const params = new URLSearchParams(window.location.search);
    let room = params.get("room");
    
    if (!room) {
      // Generate a simple random room ID if none exists
      room = Math.random().toString(36).substring(2, 9);
      const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?room=' + room;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
    setRoomId(room);

    socket.on("message", reciveMessage);
    socket.on("delete", handleDeleteEvent); // Listen for deletes

    return () => {
      socket.off("message", reciveMessage);
      socket.off("delete", handleDeleteEvent);
    };
  }, []);

  const handleLogin = (username) => {
    setUsername(username);
    socket.emit("login", { username, roomId });
  };

  const handleLogout = () => {
    socket.emit("logout");
    setUsername("");
    // Force reload to root path to generate a new room ID
    window.location.href = window.location.pathname;
  };

  const handleLoginAsAnonymous = () => {
    const anonymousUsername = `Anonymous_${Math.floor(Math.random() * 1000)}`;
    setUsername(anonymousUsername);
    socket.emit("login", { username: anonymousUsername, roomId });
  };

  const reciveMessage = (message) => {
    const newMessage = {
      body: message.body,
      from: message.from,
      type: message.type || 'text',
      caption: message.caption, // Store caption if present
      timestamp: message.time || new Date().toISOString(),
      id: message.id, // Receive ID
    };

    setMessages((state) => [newMessage, ...state].slice(0, 100)); // Auto-Cleanup: Max 100
  };

  const handleDeleteEvent = (id) => {
    setMessages((state) => state.filter((msg) => msg.id !== id));
  };

  const handleDeleteMessage = (id) => {
    // Delete local
    setMessages((state) => state.filter((msg) => msg.id !== id));
    // Verify valid ID before sending
    if(id) {
        socket.emit("delete", id);
    }
  };

  const handleSubmit = (message) => {
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
    const newMessage = {
      body: message,
      from: "Me",
      type: 'text',
      timestamp: new Date().toISOString(),
      id: id,
    };
    setMessages([newMessage, ...messages].slice(0, 100)); // Auto-Cleanup
    socket.emit("message", { body: message, id });
  };

  const handleImageSubmit = (imageData, caption) => {
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
    const newMessage = {
      body: imageData,
      from: "Me",
      type: 'image',
      caption: caption, // Store caption
      timestamp: new Date().toISOString(),
      id: id,
    };
    setMessages((prev) => [newMessage, ...prev].slice(0, 100)); // Auto-Cleanup
    socket.emit("image", { body: imageData, caption, id }); // Send caption to server
  };

  const handleAudioSubmit = (audioData) => {
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
    const newMessage = {
      body: audioData,
      from: "Me",
      type: 'audio',
      timestamp: new Date().toISOString(),
      id: id,
    };
    setMessages((prev) => [newMessage, ...prev].slice(0, 100)); // Auto-Cleanup
    socket.emit("audio", { body: audioData, id });
  };

  return (
    <>
      {username ? (
        <div className="backdrop-saturate-125 bg-white/20 rounded-2xl shadow-lg shadow-slate-900/60 p-4 w-full max-w-2xl h-[90vh] flex flex-col mt-10">
          <div>
            <div className="relative">
              <Header />
              <div className="absolute top-0 left-0 m-1">
                <ButtonShare />
              </div>
              <div className="absolute top-0 right-0 m-1">
                <ButtonLogout onLogout={handleLogout} />
              </div>
            </div>
            <FormComponent onSubmit={handleSubmit} onImageSubmit={handleImageSubmit} onAudioSubmit={handleAudioSubmit} username={username} socket={socket} />
          </div>
          <ListMessageComponent messages={messages} onDelete={handleDeleteMessage} />
          <div className="mt-auto">
             <Footer />
          </div>
        </div>
      ) : (
        <div className="backdrop-saturate-125 bg-white/20 rounded-2xl shadow-lg shadow-slate-900/60 mt-20">
          <LoginComponent
            onLogin={handleLogin}
            onLoginAsAnonymous={handleLoginAsAnonymous}
          />
          <div className="text-center mt-5 leading-tight">
            <TermsAndConditions />
            <Footer />
          </div>
        </div>
      )}
    </>
  );
}

export default App;

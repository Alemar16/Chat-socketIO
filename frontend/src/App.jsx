import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import FormComponent from "./components/FormComponent/FormComponent";
import ListMessageComponent from "./components/ListMessageComponent/ListMessageComponent";
import LoginComponent from "./components/LoginComponent/LoginComponent";
import Header from "./components/Header/Header";
import { Bars3Icon } from "@heroicons/react/24/solid";
import SideMenu from "./components/SideMenu/SideMenu";
import Footer from "./components/Footer/Footer";
import TermsAndConditions from "./components/TermsAndConditions/TermsAndConditions";
import GreetingComponent from "./components/GreetingComponent/GreetingComponent";

import notificationSound from "./assets/sounds/soft-notice-146623.mp3";
import backgroundNotificationSound from "./assets/sounds/new-notification-on-your-device-138695.mp3";
import { useTranslation } from "react-i18next";

const socket = io("/");

function App() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }
    }
  };

  const playNotification = (isBackground) => {
    if (!soundEnabledRef.current) return;
    const soundToPlay = isBackground ? backgroundNotificationSound : notificationSound;
    const audio = new Audio(soundToPlay);
    audio.play().catch(error => console.error("Audio play failed:", error));
  };

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

    const reciveMessage = (message) => {
      const newMessage = {
        body: message.body,
        from: message.from,
        type: message.type || 'text',
        caption: message.caption,
        timestamp: message.time || new Date().toISOString(),
        id: message.id,
      };

      setMessages((state) => [...state, newMessage].slice(-100));
      
      if(message.from !== "Me") {
          const isBackground = document.hidden;
          playNotification(isBackground);

          if (isBackground && Notification.permission === "granted") {
            new Notification(t('notifications.newMessage', { from: message.from }), {
              body: message.type === 'text' ? message.body : t('notifications.sentMedia'),
              icon: '/vite.svg', // Optional: Add an icon if available
            });
          }
      }
    };

    const handleDeleteEvent = (id) => {
      setMessages((state) => state.filter((msg) => msg.id !== id));
    };

    const updateConnectedUsers = (users) => {
      setConnectedUsers(users);
    };

    socket.on("message", reciveMessage);
    socket.on("delete", handleDeleteEvent);
    socket.on("users", updateConnectedUsers);

    return () => {
      socket.off("message", reciveMessage);
      socket.off("delete", handleDeleteEvent);
      socket.off("users", updateConnectedUsers);
    };
  }, [t]);

  const handleLogin = (username) => {
    setUsername(username);
    socket.emit("login", { username, roomId });
    requestNotificationPermission();
  };

  const handleLogout = () => {
    socket.emit("logout");
    setUsername("");
    window.location.href = window.location.pathname;
  };

  const handleLoginAsAnonymous = () => {
    const anonymousUsername = `Anonymous_${Math.floor(Math.random() * 1000)}`;
    setUsername(anonymousUsername);
    socket.emit("login", { username: anonymousUsername, roomId });
  };

  const handleDeleteMessage = (id) => {
    setMessages((state) => state.filter((msg) => msg.id !== id));
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
    setMessages((state) => [...state, newMessage].slice(-100)); // Auto-Cleanup
    socket.emit("message", { body: message, id });
  };

  const handleImageSubmit = (imageData, caption) => {
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
    const newMessage = {
      body: imageData,
      from: "Me",
      type: 'image',
      caption: caption,
      timestamp: new Date().toISOString(),
      id: id,
    };
    setMessages((prev) => [...prev, newMessage].slice(-100)); // Auto-Cleanup
    socket.emit("image", { body: imageData, caption, id });
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
    setMessages((prev) => [...prev, newMessage].slice(-100)); // Auto-Cleanup
    socket.emit("audio", { body: audioData, id });
  };

  return (
    <>
      {username ? (
        <div className="w-full h-[100dvh] flex items-center justify-center">
          <div className="backdrop-saturate-125 bg-white/20 shadow-lg shadow-slate-900/60 flex flex-col w-full h-[100dvh] p-0 mt-0 rounded-none md:max-w-5xl md:h-[90vh] md:p-4 md:rounded-2xl overflow-hidden">
          {/* Header Section */}
          <div className="flex-none bg-transparent">
             <div className="flex items-center justify-between p-4 bg-transparent w-full">
               <Header compact={true} />
               <button 
                 onClick={() => setIsSideMenuOpen(true)}
                 className="p-2 text-white hover:text-gray-200 transition-colors drop-shadow-md"
               >
                  <Bars3Icon className="w-8 h-8" />
               </button>
             </div>
             <SideMenu 
               isOpen={isSideMenuOpen} 
               onClose={() => setIsSideMenuOpen(false)}
               roomId={roomId}
               username={username}
               soundEnabled={soundEnabled}
               setSoundEnabled={setSoundEnabled}
               onLogout={handleLogout}
               connectedUsers={connectedUsers}
             />
          </div>
          
          {/* Messages Section - Grows to fill space */}
          <div className="flex-1 min-h-0 relative w-full overflow-hidden">
             <div className="absolute inset-0 flex flex-col">
               {username && (
                  <div className="flex-none px-4 pt-4 z-10">
                     <GreetingComponent username={username} />
                  </div>
               )}
               <ListMessageComponent messages={messages} onDelete={handleDeleteMessage} />
             </div>
          </div>

          {/* Input Section - Fixed at bottom */}
          <div className="flex-none w-full bg-transparent pb-2 pt-2">
             <FormComponent onSubmit={handleSubmit} onImageSubmit={handleImageSubmit} onAudioSubmit={handleAudioSubmit} username={username} socket={socket} />
          </div>


          </div>
        </div>
      ) : (
        <div className="w-full min-h-[100dvh] flex flex-col items-center">
            
            <div className="flex-grow flex items-center justify-center w-full">
                <div className="backdrop-saturate-125 bg-white/20 rounded-2xl w-[90%] max-w-md">
                  <LoginComponent
                    onLogin={handleLogin}
                    onLoginAsAnonymous={handleLoginAsAnonymous}
                  />
                </div>
            </div>

            <div className="text-center leading-tight mb-6 mt-4">
              <TermsAndConditions />
              <Footer />
            </div>
        </div>
      )}
    </>
  );
}

export default App;

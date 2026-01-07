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
import { generateRoomId } from "./utils/roomGenerator";
import { encryptMessage, decryptMessage } from "./utils/crypto";

const socket = io("/");

function App() {
  useTranslation();
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const soundEnabledRef = useRef(soundEnabled);
  const roomIdRef = useRef(roomId); // Ref to access current roomId in callbacks

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

// ... (moved to top)

// ... (existing imports)

// ... inside App component

  useEffect(() => {
    // Room Logic
    const params = new URLSearchParams(window.location.search);
    let room = params.get("room");
    
    if (!room) {
      // Generate a friendly room ID if none exists
      room = generateRoomId();
      const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?room=' + room;
      window.history.pushState({ path: newUrl }, '', newUrl);
    } else {
      // Normalize to lowercase
      const lowerRoom = room.toLowerCase();
      if (room !== lowerRoom) {
        room = lowerRoom;
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?room=' + room;
        window.history.replaceState({ path: newUrl }, '', newUrl);
      }
    }

    setRoomId(room);
    roomIdRef.current = room; // Sync ref

  }, []);

  useEffect(() => {
    socket.on("connect", () => {
        console.log("Connected to server");
    });

    socket.on("users", (users) => {
        setConnectedUsers(users);
    });

    socket.on("message", (message) => {
      // Decrypt incoming message
      const currentRoomId = roomIdRef.current;
      const decryptedBody = decryptMessage(message.body, currentRoomId);
      const decryptedCaption = message.caption ? decryptMessage(message.caption, currentRoomId) : undefined;
      
      const decryptedMessage = {
          ...message,
          body: decryptedBody,
          caption: decryptedCaption,
          timestamp: message.time // Map server 'time' to 'timestamp'
      };

      setMessages((state) => [...state, decryptedMessage].slice(-100));
      
      const isBackground = document.hidden;
      playNotification(isBackground);
    });

    socket.on("delete", (id) => {
        setMessages((state) => state.filter((msg) => msg.id !== id));
    });

    return () => {
      socket.off("connect");
      socket.off("users");
      socket.off("message");
      socket.off("delete");
    };
  }, []);

  const handleLogin = (username, roomCode) => {
    let finalRoomId = roomId;

    if (roomCode) {
        finalRoomId = roomCode.toLowerCase();
        // Update URL to match the new room
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?room=' + finalRoomId;
        window.history.pushState({ path: newUrl }, '', newUrl);
        setRoomId(finalRoomId);
        roomIdRef.current = finalRoomId; // Update ref
    }
    
    setUsername(username);
    socket.emit("login", { username, roomId: finalRoomId });
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
    
    // Encrypt before sending
    const encryptedBody = encryptMessage(message, roomId);
    socket.emit("message", { body: encryptedBody, id });
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
    
    // Encrypt content
    const encryptedBody = encryptMessage(imageData, roomId);
    const encryptedCaption = caption ? encryptMessage(caption, roomId) : "";
    
    socket.emit("image", { body: encryptedBody, caption: encryptedCaption, id });
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
    
    // Encrypt content
    const encryptedBody = encryptMessage(audioData, roomId);
    socket.emit("audio", { body: encryptedBody, id });
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

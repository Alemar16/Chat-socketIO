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
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

const socket = io("/");

function App() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null); // State for message being replied to
  
  const soundEnabledRef = useRef(soundEnabled);
  const roomIdRef = useRef(roomId); // Ref to access current roomId in callbacks
  const usernameRef = useRef(username); // Ref to access current username for reconnect
  const prevUsersRef = useRef([]); // Ref to store previous users for Toast logic

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
  
  const handleInitiateReply = (message) => {
    setReplyingTo(message);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

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
        // Auto-Re-Login: If we have a user and room, re-join.
        // This fixes mobile "ghost" connections after backgrounding.
        if (usernameRef.current && roomIdRef.current) {
            socket.emit("login", { 
                username: usernameRef.current, 
                roomId: roomIdRef.current 
            });
        }
    });

    socket.on("users", (users) => {
        const prevUsers = prevUsersRef.current;
        const currentIds = users.map(u => u.id);
        const prevIds = prevUsers.map(u => u.id);

        // Don't show toasts on initial load (if prev was empty)
        // OR if this is the first time populating
        if (prevUsers.length > 0) {
            // Find Joined
            users.forEach(user => {
                if (!prevIds.includes(user.id)) {
                     Toast.fire({
                        icon: 'success',
                        title: t('toasts.joined', { username: user.username })
                     });
                }
            });

            // Find Left
            prevUsers.forEach(user => {
                if (!currentIds.includes(user.id)) {
                     Toast.fire({
                        icon: 'info',
                        title: t('toasts.left', { username: user.username })
                     });
                }
            });
        }

        setConnectedUsers(users);
        prevUsersRef.current = users; // Update ref
    });

    socket.on("reaction_update", ({ messageId, reactions }) => {
        setMessages(prevMessages => prevMessages.map(msg => {
            if (msg.id === messageId) {
                return { ...msg, reactions: reactions };
            }
            return msg;
        }));
    });

    socket.on("message", (message) => {
      // Decrypt incoming message
      const currentRoomId = roomIdRef.current;
      const decryptedBody = decryptMessage(message.body, currentRoomId);
      const decryptedCaption = message.caption ? decryptMessage(message.caption, currentRoomId) : undefined;
      const decryptedReplyTo = message.replyTo ? {
          ...message.replyTo,
          // If we decided to encrypt nested reply body, we'd decrypt here.
          // For now assuming it is consistent with how we sent it.
          // If we encrypted it, we decrypt. If we sent plain text (as it was already decrypted on client before sending?),
          // we need to be careful.
          // In handleSubmit we sent `replyingTo.body` which is already decrypted in the state `messages`.
          // So the payload sent to server has PLAIN TEXT in replyTo.body (but Encrypted in main body).
          // Ideally we should encrypt it. But let's stick to the plan of sending it as is for UI consistency for now.
      } : null;
      
      const decryptedMessage = {
          ...message,
          body: decryptedBody,
          caption: decryptedCaption,
          replyTo: decryptedReplyTo, 
          timestamp: message.time // Map server 'time' to 'timestamp'
      };

      setMessages((state) => [...state, decryptedMessage].slice(-100));
      
      const isBackground = document.hidden;
      playNotification(isBackground);
    });

    socket.on("delete", (id) => {
        setMessages((state) => state.filter((msg) => msg.id !== id));
    });

    socket.on("history", (historyMessages) => {
        const currentRoomId = roomIdRef.current;
        const decryptedHistory = historyMessages.map(msg => ({
            ...msg,
            body: decryptMessage(msg.body, currentRoomId),
            replyTo: msg.replyTo, // Assuming history preserves structure
            timestamp: msg.time // Map server 'time' to 'timestamp'
        }));
        // Rewrite messages with history (since it's a reload/join)
        setMessages(decryptedHistory); 
    });

    return () => {
      socket.off("connect");
      socket.off("users");
      socket.off("message");
      socket.off("message");
      socket.off("users");
      socket.off("message");
      socket.off("delete");
      socket.off("history");
      socket.off("reaction_update");
    };
  }, [t]);

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
    usernameRef.current = username; // Update ref
    socket.emit("login", { username, roomId: finalRoomId });
    requestNotificationPermission();
  };

  const handleLogout = () => {
    socket.emit("logout");
    setUsername("");
    usernameRef.current = ""; // Reset ref
    window.location.href = window.location.pathname;
  };

  const handleLoginAsAnonymous = () => {
    const anonymousUsername = `Anonymous_${Math.floor(Math.random() * 1000)}`;
    setUsername(anonymousUsername);
    usernameRef.current = anonymousUsername; // Update ref
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
      replyTo: replyingTo ? {
        id: replyingTo.id,
        body: replyingTo.body,
        from: replyingTo.from
      } : null
    };
    setMessages((state) => [...state, newMessage].slice(-100)); // Auto-Cleanup
    setReplyingTo(null); // Clear reply state
    
    // Encrypt before sending
    const encryptedBody = encryptMessage(message, roomId);
    socket.emit("message", { 
        body: encryptedBody, 
        id,
        replyTo: replyingTo ? {
            id: replyingTo.id,
            from: replyingTo.from,
            body: replyingTo.body
        } : null
    });
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

  const handleReaction = (messageId, emoji) => {
      socket.emit("reaction", { messageId, emoji });
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
               <ListMessageComponent 
              messages={messages} 
              onDelete={handleDeleteMessage}
              onReact={handleReaction}
              onReply={handleInitiateReply}
              currentUser={username} 
          />
             </div>
          </div>

          {/* Input Section - Fixed at bottom */}
          <div className="flex-none w-full bg-transparent pb-2 pt-2">
             <FormComponent 
                onSubmit={handleSubmit} 
                onImageSubmit={handleImageSubmit} 
                onAudioSubmit={handleAudioSubmit} 
                username={username} 
                socket={socket} 
                replyingTo={replyingTo}
                onCancelReply={handleCancelReply}
             />
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

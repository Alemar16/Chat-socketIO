import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import { resolve } from "path";
import morgan from "morgan";
import { PORT } from "./config.js";
import helmet from "helmet";
import { RateLimiter } from "./rateLimiter.js";


const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  maxHttpBufferSize: 1e7, // Increase limit to 10MB
  cors: {
    origin: "*", // Allow all origins (since we're serving static files, but good for dev)
  }
});

// Rate Limiter: 5 messages per second per user
const rateLimiter = new RateLimiter(5, 1000);

const users = {};
const roomHistory = {}; // Volatile RAM History: { roomId: [messages] }

// Basic security headers with Custom CSP for Media
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "ws:", "wss:"], // Allow websockets
      imgSrc: ["'self'", "data:", "blob:"], // Allow images from data URI
      mediaSrc: ["'self'", "data:", "blob:"], // Allow audio/video from data URI (CRITICAL for Voice Messages)
      scriptSrc: ["'self'", "'unsafe-inline'"], // Valid for simple React apps, ideally hash based
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));

// Logging - only log non-sensitive request info (method, url, status)
app.use(morgan("dev"));

//uso de express para levantar el front
app.use(express.static(resolve("frontend/dist"))); //desde server se levanta el front.

//conexion socket io con hash de usuarios
io.on("connection", (socket) => {


  // Emitir la lista de usuarios al cliente cuando hay un cambio
  // updateConnectedUsers(); // Don't broadcast to everyone on connect, wait for room join

  // Escuchar el evento de inicio de sesión
  // Escuchar el evento de inicio de sesión con sala
  socket.on("login", ({ username, roomId }) => {
    // Normalize room ID to ensure case-insensitivity
    const normalizedRoomId = roomId ? roomId.toLowerCase() : "general"; 

    // Join the room
    socket.join(normalizedRoomId);

    // Store user info including room
    users[socket.id] = { username, roomId: normalizedRoomId };
    

    
    // Verify if room has history and emit it to THIS user
    if (roomHistory[normalizedRoomId]) {
        socket.emit("history", roomHistory[normalizedRoomId]);
    }
    
    // Update users ONLY in that room
    updateConnectedUsers(normalizedRoomId);
  });

  // Escuchar el evento de desconexión
  socket.on("disconnect", () => {
    handleUserDisconnect(socket);
  });

  // Escuchar el evento de desconexión por logout
  socket.on("logout", () => {
    handleUserDisconnect(socket);
  });

  // Función para manejar el evento de desconexión
  function handleUserDisconnect(socket) {
    const user = users[socket.id];
    if (user) {
      const { username, roomId } = user;

      
      delete users[socket.id];
      rateLimiter.cleanup(socket.id); // Clean up rate limiter memory

      // Emitir la lista actualizada solo a esa sala
      updateConnectedUsers(roomId);

      // Check if room is empty to clean up history (Save RAM)
      const remainingUsers = Object.values(users).filter(u => u.roomId === roomId).length;
      if (remainingUsers === 0) {
          delete roomHistory[roomId]; // Free memory
      }
    }
  }



  // Escuchar el evento de mensaje
  socket.on("message", (payload) => {
    try {
        // Support object payload with ID or simple string
        const body = typeof payload === 'object' ? payload.body : payload;
        const id = typeof payload === 'object' ? payload.id : null;

        // 1. Rate Limiting Check
        if (!rateLimiter.check(socket.id)) {
            return; // Silently drop spam
        }

        // 2. Validate that body is a string
        if (typeof body !== 'string') return;
    
        const user = users[socket.id];
        if (user) {
            // Log removed for privacy
        }

        // Obtener la hora actual
        const currentTime = new Date().toISOString();

        const userSender = users[socket.id];
        if (userSender && userSender.roomId) {
            socket.to(userSender.roomId).emit("message", {
                body: body.slice(0, 5000), // Hard limit of 5000 chars
                from: userSender.username || "Anonymous",
                type: 'text',
                time: currentTime,
                id: id, // Propagate ID
            });

            // Save to History (Text Only)
            if (!roomHistory[userSender.roomId]) {
                roomHistory[userSender.roomId] = [];
            }
            roomHistory[userSender.roomId].push({
                body: body.slice(0, 5000),
                from: userSender.username || "Anonymous",
                type: 'text',
                time: currentTime,
                id: id,
            });
        }
    } catch (error) {
       console.error("Socket Error:", error.message);
    }
  });

  // Handle Image Events
  socket.on("image", (payload) => {
    try {
        // Support object payload with ID or simple string
        const imageData = typeof payload === 'object' ? payload.body : payload;
        const id = typeof payload === 'object' ? payload.id : null;
        const caption = typeof payload === 'object' ? payload.caption : ""; // Extract caption

        // 1. Rate Limiting (re-use same limiter to prevent flood)
        if (!rateLimiter.check(socket.id)) return;

        // 2. Validate Payload
        if (typeof imageData !== 'string') return;
        
        // Check size (allow up to 5MB of Base64)
        if (imageData.length > 7000000) { 
            return; 
        }

        // Check if it's actually an image
        // REMOVED: Since content is ENCRYPTED, we cannot check headers here.
        // if (!imageData.startsWith('data:image/')) return;

        const userSender = users[socket.id];
        if (userSender && userSender.roomId) {
            const currentTime = new Date().toISOString(); // ISO string for frontend date-fns

            // Broadcast to room
            socket.to(userSender.roomId).emit("message", {
                body: imageData,
                from: userSender.username || "Anonymous",
                type: 'image', // Explicit type
                caption: caption, // Broadcast caption
                time: currentTime,
                id: id, // Propagate ID
            });
            
             // Save Placeholder to History (Save RAM, Keep Context)
             if (!roomHistory[userSender.roomId]) {
                 roomHistory[userSender.roomId] = [];
             }
             roomHistory[userSender.roomId].push({
                 body: null, // No heavy data
                 from: userSender.username || "Anonymous",
                 type: 'placeholder_image', // Special type for frontend rendering
                 time: currentTime,
                 id: id,
             });
        }
    } catch (error) {
        console.error("Image Error:", error.message);
    }
  });

  // Handle Audio Events
  socket.on("audio", (payload) => {
    try {
        const audioData = typeof payload === 'object' ? payload.body : payload;
        const id = typeof payload === 'object' ? payload.id : null;

        if (!rateLimiter.check(socket.id)) return;

        if (typeof audioData !== 'string') return;

        // Check size (allow up to 7MB for Base64 audio, approx 5MB binary)
        if (audioData.length > 10000000) return;

        // Verify it is audio
        // REMOVED: Content is ENCRYPTED, cannot verify header.
        // if (!audioData.startsWith('data:audio/')) return;

        const userSender = users[socket.id];
        if (userSender && userSender.roomId) {
            const currentTime = new Date().toISOString();

            socket.to(userSender.roomId).emit("message", {
                body: audioData,
                from: userSender.username || "Anonymous",
                type: 'audio',
                time: currentTime,
                id: id,
            });

            // Save Placeholder to History
            if (!roomHistory[userSender.roomId]) {
                roomHistory[userSender.roomId] = [];
            }
            roomHistory[userSender.roomId].push({
                body: null,
                from: userSender.username || "Anonymous",
                type: 'placeholder_audio',
                time: currentTime,
                id: id,
            });
        }
    } catch (error) {
        console.error("Audio Error:", error.message);
    }
  });

  // Handle Delete Event
  socket.on("delete", (messageId) => {
      const user = users[socket.id];
      if (user && user.roomId) {
          // Broadcast delete to room
          socket.to(user.roomId).emit("delete", messageId);
      }
  });

  // Función para emitir la lista de usuarios a todos los clientes DE UNA SALA
  function updateConnectedUsers(roomId) {
    // Filter users belonging to this room
    const roomUsers = Object.entries(users)
        .filter(([id, u]) => u.roomId === roomId)
        .map(([id, u]) => ({
            id: id,
            username: u.username,
        }));
        
    io.to(roomId).emit("users", roomUsers);
  }
});

// Arrancar el servidor según el puerto
server.listen(PORT);
console.log("Server on", PORT);

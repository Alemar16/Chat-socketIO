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
const io = new SocketServer(server);

// Rate Limiter: 5 messages per second per user
const rateLimiter = new RateLimiter(5, 1000);

const users = {};

// Basic security headers
app.use(helmet());

// Logging - only log non-sensitive request info (method, url, status)
app.use(morgan("dev"));

//uso de express para levantar el front
app.use(express.static(resolve("frontend/dist"))); //desde server se levanta el front.

//conexion socket io con hash de usuarios
io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  // Emitir la lista de usuarios al cliente cuando hay un cambio
  // updateConnectedUsers(); // Don't broadcast to everyone on connect, wait for room join

  // Escuchar el evento de inicio de sesión
  // Escuchar el evento de inicio de sesión con sala
  socket.on("login", ({ username, roomId }) => {
    // Join the room
    socket.join(roomId);

    // Store user info including room
    users[socket.id] = { username, roomId };
    
    console.log(`${socket.id} ${username} joined ${roomId}`);
    
    // Update users ONLY in that room
    updateConnectedUsers(roomId);
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
      console.log(`${socket.id} ${username} disconnected from ${roomId}`);
      
      delete users[socket.id];
      rateLimiter.cleanup(socket.id); // Clean up rate limiter memory

      // Emitir la lista actualizada solo a esa sala
      updateConnectedUsers(roomId);
    }
  }



  // Escuchar el evento de mensaje
  socket.on("message", (body) => {
    try {
        // 1. Rate Limiting Check
        if (!rateLimiter.check(socket.id)) {
            // Optional: Emit warning to user
            // socket.emit("error", "Rate limit exceeded. Please slow down.");
            return; // Silently drop spam
        }

        // 2. Validate that body is a string
    // Validate that body is a string and truncate if necessary to prevent logging massive payloads
    if (typeof body !== 'string') return;
    
    // Privacy: Do NOT log the message content.
    // Privacy: Do NOT log the message content.
    const user = users[socket.id];
    if (user) {
        console.log(
        `${user.username} sent a message in ${user.roomId} at ${new Date().toLocaleTimeString()}`
        );
    }

    // Obtener la hora actual
    const currentTime = new Date().toLocaleTimeString();

    // Enviar el mensaje de confirmación
    /*  socket.emit("messageConfirmation", {
      body: `Mensaje recibido correctamente a las ${currentTime}.`,
      from: "Server",
    }); */

    // Responder al mensaje
    // Retransmit without storing
    // Responder al mensaje
    // Retransmit without storing (Broadcast ONLY to room)
    const userSender = users[socket.id];
    if (userSender && userSender.roomId) {
        socket.to(userSender.roomId).emit("message", {
            body: body.slice(0, 5000), // Hard limit of 5000 chars
            from: userSender.username || "Anonymous",
            time: currentTime,
        });
    }
    } catch (error) {
       console.error("Socket Error:", error.message);
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

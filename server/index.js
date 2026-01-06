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
  updateConnectedUsers();

  // Escuchar el evento de inicio de sesión
  socket.on("login", (username) => {
    users[socket.id] = username;
    console.log(`${socket.id} ${users[socket.id]} connected`);
    updateConnectedUsers();
  });

  // Escuchar el evento de desconexión
  socket.on("disconnect", () => {
    handleUserDisconnect(socket);
    updateConnectedUsers();
  });

  // Escuchar el evento de desconexión por logout
  socket.on("logout", () => {
    handleUserDisconnect(socket);
    updateConnectedUsers();
  });

  // Función para manejar el evento de desconexión
  function handleUserDisconnect(socket) {
    const username = users[socket.id];
    console.log(`${socket.id} ${username} disconnected`);
    delete users[socket.id];
    rateLimiter.cleanup(socket.id); // Clean up rate limiter memory

    // Emitir la lista actualizada después de desconectar un usuario
    updateConnectedUsers();
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
    console.log(
      `${users[socket.id]} sent a message at ${new Date().toLocaleTimeString()}`
    );

    // Obtener la hora actual
    const currentTime = new Date().toLocaleTimeString();

    // Enviar el mensaje de confirmación
    /*  socket.emit("messageConfirmation", {
      body: `Mensaje recibido correctamente a las ${currentTime}.`,
      from: "Server",
    }); */

    // Responder al mensaje
    // Retransmit without storing
    socket.broadcast.emit("message", {
      body: body.slice(0, 5000), // Hard limit of 5000 chars
      from: users[socket.id] || "Anonymous",
      time: currentTime,
    });
    } catch (error) {
       console.error("Socket Error:", error.message);
    }
  });

  // Función para emitir la lista de usuarios a todos los clientes
  function updateConnectedUsers() {
    const connectedUsers = Object.values(users).map((username) => ({
      id: socket.id,
      username,
    }));
    io.emit("users", connectedUsers);
  }
});

// Arrancar el servidor según el puerto
server.listen(PORT);
console.log("Server on", PORT);

import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import { resolve } from "path";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

const users = {};
//console.log(resolve('frontend/dist'));

app.use(express.static(resolve('frontend/dist')));//desde server se levanta el front.

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  socket.on("login", (username) => {
    users[socket.id] = username;
    console.log(`${socket.id} ${users[socket.id]} connected`);
  });

  socket.on("disconnect", () => {
    handleUserDisconnect(socket);
  });

  socket.on("logout", () => {
    handleUserDisconnect(socket);
  });

  function handleUserDisconnect(socket) {
    const username = users[socket.id];
    console.log(`${socket.id} ${username} disconnected`);
    delete users[socket.id];
  }

  socket.on("message", (body) => {
    // Escuchar el mensaje
    console.log(
      `${users[socket.id]} dice: ${body} - ${new Date().toLocaleTimeString()}`
    );

    const currentTime = new Date().toLocaleTimeString();

    // Emitir una confirmación al remitente con la hora
    socket.emit("messageConfirmation", {
      body: `Mensaje recibido correctamente a las ${currentTime}.`,
      from: "Server",
    });

    socket.broadcast.emit("message", {
      body,
      from: users[socket.id] || "Anonymous", // socket.id.slice(6) Mostrar el nombre de usuario si está disponible; de lo contrario, mostrar el ID. users[socket.id.slice(6), // Mostrar el nombre de usuario si está disponible; de lo contrario, mostrar el ID
      time: currentTime,
    }); // Responder al mensaje
  });
});

server.listen(3000, () => {
  console.log("Server on port 3000");
});

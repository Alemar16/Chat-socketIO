import { time } from "console";
import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("message", (body) => {
    //escuchar el mensaje
    console.log(body);

    const currentTime = new Date().toLocaleTimeString();

    // Emite una confirmación al remitente con la hora
    socket.emit("messageConfirmation", {
      body: `Mensaje recibido correctamente a las ${currentTime}.`,
      from: "Server",
    });

    socket.broadcast.emit("message", {
      body,
      from: socket.id.slice(6), //para mostrar solo el id del cliente que envia
      time: currentTime,
    }); //reponde el mensaje
  });
});

server.listen(3000, () => {
  console.log("Server on port 3000");
});

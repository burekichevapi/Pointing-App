import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const httpServer = http.createServer(app);

const socketServer = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

socketServer.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("send_point", (data) => {
    console.log(data);
    socket.broadcast.emit("receive_point", data);
  });
});

httpServer.listen(3000, () => {
  console.log("Running backend on 3000");
});

socketServer.disconnectSockets();
httpServer.closeAllConnections();

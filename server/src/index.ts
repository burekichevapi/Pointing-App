import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import User from "./models/user.js";

const app = express();
app.use(cors());

const httpServer = http.createServer(app);

const socketServer = new Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? false : ["http://localhost:5173"],
    methods: ["GET", "POST"]
  }
});

const ROOMS = new Map<string, User[]>();

socketServer.on("connection", (socket) => {
  socket.on("create_room", (user: User) => {
    socket.join(user.roomId);
    ROOMS.set(user.roomId, [user]);

    console.log("created:\n", ROOMS.get(user.roomId));
    socket
      .timeout(5000)
      .to(user.roomId)
      .emit("get_votes", ROOMS.get(user.roomId));
  });

  socket.on("join_room", (user: User) => {
    socket.join(user.roomId);
    const users = ROOMS.get(user.roomId);
    if (users === null || users === undefined) return;

    users.push(user);
    ROOMS.set(user.roomId, users);

    console.log("joined:\n", ROOMS.get(user.roomId));
    socket
      .timeout(5000)
      .to(user.roomId)
      .emit("get_votes", ROOMS.get(user.roomId));
  });

  socket.on("send_vote", (user: User) => {
    const users = ROOMS.get(user.roomId);
    if (users === null || users === undefined) return;

    const idx = users.findIndex((u) => u.username === user.username);
    users[idx] = user;

    ROOMS.set(user.roomId, users);

    console.log("voted:\n", ROOMS.get(user.roomId));
    socket
      .timeout(5000)
      .to(user.roomId)
      .emit("get_votes", ROOMS.get(user.roomId));
  });

  socket.on("reveal_votes", (roomId: string) => {
    socket.timeout(5000).to(roomId).emit("show_votes");
  });

  socket.on("on_load", (roomId: string) => {
    console.log("loaded:\n", ROOMS.get(roomId));
    socket.timeout(5000).to(roomId).emit("get_votes", ROOMS.get(roomId));
  });
});

httpServer.listen(3000, () => {
  console.log("Running backend on 3000");
});

socketServer.disconnectSockets();
httpServer.closeAllConnections();

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

class Event {
  public static get CREATE_ROOM(): string {
    return `create_room`;
  }
  public static get JOIN_ROOM(): string {
    return `join_room`;
  }
  public static get SHOW_VOTES(): string {
    return `show_votes`;
  }
  public static get SEND_VOTE(): string {
    return `send_vote`;
  }
  public static get UPDATE_VOTES(): string {
    return `update_votes`;
  }
  public static get PAGE_LOAD(): string {
    return `page_load`;
  }
  public static get USER_LEAVE_ROOM(): string {
    return `user_leave_room`;
  }
}

socketServer.on("connection", (socket) => {
  socket.on(Event.CREATE_ROOM, (user: User) => {
    console.log(ROOMS);
    socket.join(user.roomId);
    ROOMS.set(user.roomId, [user]);

    socket
      .timeout(5000)
      .to(user.roomId)
      .emit(Event.UPDATE_VOTES, ROOMS.get(user.roomId));
  });

  socket.on(Event.JOIN_ROOM, (user: User) => {
    socket.join(user.roomId);
    const users = ROOMS.get(user.roomId);
    users.push(user);
    ROOMS.set(user.roomId, users);

    socket
      .timeout(5000)
      .to(user.roomId)
      .emit(Event.UPDATE_VOTES, ROOMS.get(user.roomId));
  });

  socket.on(Event.SEND_VOTE, (user: User) => {
    const users = ROOMS.get(user.roomId);
    const idx = users.findIndex((u) => u.username === user.username);
    users[idx] = user;

    ROOMS.set(user.roomId, users);

    socket
      .timeout(5000)
      .to(user.roomId)
      .emit(Event.UPDATE_VOTES, ROOMS.get(user.roomId));
  });

  socket.on(Event.SHOW_VOTES, (roomId: string) => {
    socket.timeout(5000).to(roomId).emit(Event.SHOW_VOTES);
  });

  socket.on(Event.PAGE_LOAD, (roomId: string) => {
    socket.timeout(5000).to(roomId).emit(Event.UPDATE_VOTES, ROOMS.get(roomId));
  });

  socket.on(Event.USER_LEAVE_ROOM, (user: User) => {
    socket.leave(user.roomId);
    socket.disconnect();

    const users = ROOMS.get(user.roomId);
    const updatedUsers = users.filter((u) => u.username !== user.username);
    ROOMS.set(user.roomId, updatedUsers);

    if (!updatedUsers.length) {
      ROOMS.delete(user.roomId);
      socketServer.in(user.roomId).disconnectSockets(true);
      return;
    }

    socket.timeout(5000).to(user.roomId).emit(Event.UPDATE_VOTES, updatedUsers);
  });
});

httpServer.listen(3000, () => {
  console.log("Running backend on 3000");
});

socketServer.disconnectSockets(true);
httpServer.closeAllConnections();

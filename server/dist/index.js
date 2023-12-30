import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
const app = express();
app.use(cors());
const httpServer = http.createServer(app);
const socketServer = new Server(httpServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5173"],
        methods: ["GET", "POST"]
    }
});
const ROOMS = new Map();
class Communicate {
    static get CREATE_ROOM() {
        return `create_room`;
    }
    static get JOIN_ROOM() {
        return `join_room`;
    }
    static get SHOW_VOTES() {
        return `show_votes`;
    }
    static get SEND_VOTE() {
        return `send_vote`;
    }
    static get UPDATE_VOTES() {
        return `update_votes`;
    }
    static get PAGE_LOAD() {
        return `page_load`;
    }
    static get USER_LEAVE_ROOM() {
        return `user_leave_room`;
    }
}
socketServer.on("connection", (socket) => {
    socket.on(Communicate.CREATE_ROOM, (user) => {
        console.log(ROOMS);
        socket.join(user.roomId);
        ROOMS.set(user.roomId, [user]);
        socket
            .timeout(5000)
            .to(user.roomId)
            .emit(Communicate.UPDATE_VOTES, ROOMS.get(user.roomId));
    });
    socket.on(Communicate.JOIN_ROOM, (user) => {
        socket.join(user.roomId);
        const users = ROOMS.get(user.roomId);
        users.push(user);
        ROOMS.set(user.roomId, users);
        socket
            .timeout(5000)
            .to(user.roomId)
            .emit(Communicate.UPDATE_VOTES, ROOMS.get(user.roomId));
    });
    socket.on(Communicate.SEND_VOTE, (user) => {
        const users = ROOMS.get(user.roomId);
        const idx = users.findIndex((u) => u.username === user.username);
        users[idx] = user;
        ROOMS.set(user.roomId, users);
        socket
            .timeout(5000)
            .to(user.roomId)
            .emit(Communicate.UPDATE_VOTES, ROOMS.get(user.roomId));
    });
    socket.on(Communicate.SHOW_VOTES, (roomId) => {
        socket.timeout(5000).to(roomId).emit(Communicate.SHOW_VOTES);
    });
    socket.on(Communicate.PAGE_LOAD, (roomId) => {
        socket
            .timeout(5000)
            .to(roomId)
            .emit(Communicate.UPDATE_VOTES, ROOMS.get(roomId));
    });
    socket.on(Communicate.USER_LEAVE_ROOM, (user) => {
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
        socket
            .timeout(5000)
            .to(user.roomId)
            .emit(Communicate.UPDATE_VOTES, updatedUsers);
    });
});
httpServer.listen(3000, () => {
    console.log("Running backend on 3000");
});
socketServer.disconnectSockets();
httpServer.closeAllConnections();
//# sourceMappingURL=index.js.map
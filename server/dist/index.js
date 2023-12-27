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
}
socketServer.on("connection", (socket) => {
    socket.on(Communicate.CREATE_ROOM, (user) => {
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
        if (users === null || users === undefined)
            return;
        users.push(user);
        ROOMS.set(user.roomId, users);
        console.log("joined:\n", ROOMS.get(user.roomId));
        socket
            .timeout(5000)
            .to(user.roomId)
            .emit(Communicate.UPDATE_VOTES, ROOMS.get(user.roomId));
    });
    socket.on(Communicate.SEND_VOTE, (user) => {
        const users = ROOMS.get(user.roomId);
        console.log("vote sent");
        if (users === null || users === undefined)
            return;
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
    socket.on("on_load", (roomId) => {
        socket
            .timeout(5000)
            .to(roomId)
            .emit(Communicate.UPDATE_VOTES, ROOMS.get(roomId));
    });
});
httpServer.listen(3000, () => {
    console.log("Running backend on 3000");
});
socketServer.disconnectSockets();
httpServer.closeAllConnections();
//# sourceMappingURL=index.js.map
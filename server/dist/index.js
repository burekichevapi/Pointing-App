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
const ROOMS = new Map();
socketServer.on("connection", (socket) => {
    socket.on("create_room", (data) => {
        socket.join(data.roomId);
        ROOMS.set(data.roomId, [data.user]);
        console.log("Room created...");
        console.log(ROOMS);
        socket.to(data.roomId).emit("update_votes", ROOMS.get(data.roomId));
    });
    socket.on("join_room", (user) => {
        socket.join(user.roomId);
        const users = ROOMS.get(user.roomId);
        if (users === null || users === undefined)
            return;
        users.push(user);
        ROOMS.set(user.roomId, users);
        socket.to(user.roomId).emit("update_votes", ROOMS.get(user.roomId));
    });
    socket.on("send_point", (user) => {
        const users = ROOMS.get(user.roomId);
        if (users === null || users === undefined)
            return;
        const idx = users.findIndex((u) => u.username === user.username);
        users[idx] = user;
        ROOMS.set(user.roomId, users);
        console.log("Room joined...");
        console.log(ROOMS);
        socket.to(user.roomId).emit("update_votes", ROOMS.get(user.roomId));
    });
    socket.on("reveal_votes", (roomId) => {
        console.log("show votes for room", roomId);
        socket.to(roomId).emit("show_votes");
    });
});
httpServer.listen(3000, () => {
    console.log("Running backend on 3000");
});
socketServer.disconnectSockets();
httpServer.closeAllConnections();
//# sourceMappingURL=index.js.map
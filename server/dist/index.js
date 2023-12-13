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
        console.log(data.user);
        console.log(ROOMS);
        for (const [k, v] of ROOMS) {
            console.log("in loop");
            console.log("k=", k);
            console.log("v=", v);
        }
        socket.to(data.roomId).emit("update_votes", ROOMS.get(data.roomId));
    });
    socket.on("join_room", (user) => {
        socket.join(user.roomId);
        console.log("user is ", user);
        const users = ROOMS.get(user.roomId);
        console.log("users = ", users);
        if (users === null || users === undefined)
            return;
        users.push(user);
        ROOMS.set(user.roomId, users);
        console.log("Room joined...");
        console.log(user);
        console.log(ROOMS);
        socket.to(user.roomId).emit("update_votes", ROOMS.get(user.roomId));
    });
    socket.on("send_point", (user) => {
        const users = ROOMS.get(user.roomId);
        if (users === null || users === undefined)
            return;
        const idx = users.indexOf(user);
        users[idx] = user;
        ROOMS.set(user.roomId, users);
        console.log("Room joined...");
        console.log(user);
        console.log(ROOMS);
        socket.to(user.roomId).emit("update_votes", ROOMS.get(user.roomId));
    });
});
httpServer.listen(3000, () => {
    console.log("Running backend on 3000");
});
socketServer.disconnectSockets();
httpServer.closeAllConnections();
//# sourceMappingURL=index.js.map
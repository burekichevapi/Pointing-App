import io from "socket.io-client";
import User from "./models/user";

const SOCKET = io("http://localhost:3000", { transports: ["websocket"] });

export const emitPoint = (user: User) => {
  if (user.point! <= 0) return;

  SOCKET.emit("send_point", user);
};

export const listenPointSelectionBroadcast = (): Promise<User[]> => {
  return new Promise((resolve) => {
    SOCKET.on("update_votes", (users: User[]) => {
      resolve(users);
    });
  });
};

export const createRoom = (roomId: string, user: User) => {
  console.log(user);
  SOCKET.emit("create_room", { roomId, user });
};

export const joinRoom = (user: User) => {
  SOCKET.emit("join_room", user);
};

import io from "socket.io-client";

const SOCKET = io("http://localhost:3000", { transports: ["websocket"] });

export interface SendPointSelection {
  roomId: string;
  point: number;
}

export const emitPointSelection = (pointSelection: SendPointSelection) => {
  SOCKET.emit("send_point", pointSelection);
};

export const listenPointSelectionBroadcast = () => {
  return new Promise((resolve) => {
    SOCKET.on("receive_point", (data) => {
      resolve(data.point);
    });
  });
};

export const joinNewRoom = (roomId: string) => {
  SOCKET.emit("join_room", roomId);
};

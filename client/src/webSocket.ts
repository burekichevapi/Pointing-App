import io from "socket.io-client";

const socket = io("http://localhost:3000", { transports: ["websocket"] });

export const emitPointSelection = (point: number) => {
  socket.emit("send_point", {
    point
  });
};

export const listenPointSelectionBroadcast = () => {
  return new Promise((resolve) => {
    socket.on("receive_point", (data) => {
      resolve(data.point);
    });
  });
};

import io from "socket.io-client";

const URL =
  process.env.NODE_ENV === "production"
    ? window.location.hostname
    : "http://localhost:3000";

export const SOCKET = io(URL, {
  autoConnect: false,
  transports: ["websocket"]
});

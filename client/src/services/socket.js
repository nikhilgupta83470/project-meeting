import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
  autoConnect: false,
});

export function connectSocket() {
  const token = localStorage.getItem("watch_token");
  socket.auth = { token };
  socket.connect();
}

export default socket;

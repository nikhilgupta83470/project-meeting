import { createContext, useContext, useEffect, useState } from "react";
import socket, { connectSocket } from "../services/socket";
import React from "react";
const RoomContext = createContext(null);

export function RoomProvider({ children }) {
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [connected, setConnected] = useState(false);
  const [playback, setPlayback] = useState({ playing: false, currentTime: 0, videoId: "" });
  const [callActive, setCallActive] = useState(false);

  useEffect(() => {
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("room:state", data => {
      setRoom(data.room);
      setParticipants(data.participants || []);
      setPlayback(data.playback || { playing:false, currentTime:0, videoId:"" });
      setMessages(data.messages || []);
      setCallActive(Boolean(data.callActive));
    });
    socket.on("participants:update", setParticipants);
    socket.on("chat:new", message => setMessages(prev => [...prev, message]));
    socket.on("playback:update", setPlayback);
    socket.on("call:started", () => setCallActive(true));
    socket.on("call:stopped", () => setCallActive(false));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("room:state");
      socket.off("participants:update");
      socket.off("chat:new");
      socket.off("playback:update");
      socket.off("call:started");
      socket.off("call:stopped");
    };
  }, []);

  function joinRoom(roomCode, user) {
    if (!socket.connected) connectSocket();
    const setup = JSON.parse(localStorage.getItem("room_setup") || "null");
    socket.emit("room:join", { roomCode, roomName: setup?.code === roomCode ? setup.name : undefined, videoId: setup?.code === roomCode ? setup.video : undefined });
  }

  function leaveRoom() {
    socket.emit("room:leave");
    setRoom(null);
    setParticipants([]);
    setMessages([]);
  }

  return (
    <RoomContext.Provider value={{
      socket, room, setRoom, messages, participants, connected,
      playback, setPlayback, callActive, setCallActive, joinRoom, leaveRoom
    }}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  return useContext(RoomContext);
}

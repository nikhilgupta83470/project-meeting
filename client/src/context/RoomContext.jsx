```jsx
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
  const [reactions, setReactions] = useState([]);
  const [raisedHands, setRaisedHands] = useState([]);

  useEffect(() => {
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("room:state", data => {
      setRoom(data.room);
      setParticipants(data.participants || []);
      setPlayback(data.playback || { playing:false, currentTime:0, videoId:"" });
      setMessages(data.messages || []);
      setCallActive(Boolean(data.callActive));
      setReactions([]);
      setRaisedHands([]);
    });

    socket.on("participants:update", setParticipants);
    socket.on("chat:new", message => setMessages(prev => [...prev, message]));
    socket.on("playback:update", setPlayback);

    socket.on("call:started", () => setCallActive(true));
    socket.on("call:stopped", () => setCallActive(false));

    socket.on("room:event", data => {
      if (!data) return;

      if (data.type === "raise-hand") {
        setRaisedHands(prev => {
          if (prev.includes(data.user)) return prev;
          return [...prev, data.user];
        });
      }

      if (data.type === "reaction") {
        const reaction = {
          id: Date.now() + Math.random(),
          value: data.value,
          user: data.user
        };

        setReactions(prev => [...prev, reaction]);

        setTimeout(() => {
          setReactions(prev =>
            prev.filter(item => item.id !== reaction.id)
          );
        }, 3000);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("room:state");
      socket.off("participants:update");
      socket.off("chat:new");
      socket.off("playback:update");
      socket.off("call:started");
      socket.off("call:stopped");
      socket.off("room:event");
    };
  }, []);

  function joinRoom(roomCode, user) {
    const setup = JSON.parse(localStorage.getItem("room_setup") || "null");

    const join = () => {
      console.log("Joining room:", roomCode);

      socket.emit("room:join", {
        roomCode,
        roomName: setup?.code === roomCode ? setup.name : undefined,
        videoId: setup?.code === roomCode ? setup.video : undefined
      });
    };

    if (socket.connected) {
      join();
      return;
    }

    socket.once("connect", join);
    connectSocket();
  }

  function leaveRoom() {
    socket.emit("room:leave");

    setRoom(null);
    setParticipants([]);
    setMessages([]);
    setReactions([]);
    setRaisedHands([]);
  }

  return (
    <RoomContext.Provider value={{
      socket,
      room,
      setRoom,
      messages,
      participants,
      connected,
      playback,
      setPlayback,
      callActive,
      setCallActive,
      reactions,
      raisedHands,
      joinRoom,
      leaveRoom
    }}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  return useContext(RoomContext);
}
```;

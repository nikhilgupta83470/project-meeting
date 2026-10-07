```jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import socket, { connectSocket } from "../services/socket";
import { useRoom } from "../context/RoomContext";

const RoomContext = createContext(null);

export function RoomProvider({ children }) {
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [connected, setConnected] = useState(false);

  const [playback, setPlayback] = useState({
    playing: false,
    currentTime: 0,
    videoId: "",
  });

  const [callActive, setCallActive] = useState(false);

  useEffect(() => {
    function handleConnect() {
      console.log("Socket connected:", socket.id);
      setConnected(true);
    }

    function handleDisconnect() {
      console.log("Socket disconnected");
      setConnected(false);
    }

    function handleRoomState(data) {
      setRoom(data.room || null);
      setParticipants(data.participants || []);
      setMessages(data.messages || []);

      setPlayback(
        data.playback || {
          playing: false,
          currentTime: 0,
          videoId: "",
        }
      );

      setCallActive(Boolean(data.callActive));
    }

    function handleParticipantsUpdate(data) {
      setParticipants(data || []);
    }

    function handleNewMessage(message) {
      setMessages((prev) => [...prev, message]);
    }

    function handlePlaybackUpdate(data) {
      setPlayback((prev) => ({
        ...prev,
        ...data,
      }));
    }

    function handleCallStarted() {
      setCallActive(true);
    }

    function handleCallStopped() {
      setCallActive(false);
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    socket.on("room:state", handleRoomState);
    socket.on("participants:update", handleParticipantsUpdate);
    socket.on("chat:new", handleNewMessage);
    socket.on("playback:update", handlePlaybackUpdate);

    socket.on("call:started", handleCallStarted);
    socket.on("call:stopped", handleCallStopped);

    if (socket.connected) {
      setConnected(true);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);

      socket.off("room:state", handleRoomState);
      socket.off("participants:update", handleParticipantsUpdate);
      socket.off("chat:new", handleNewMessage);
      socket.off("playback:update", handlePlaybackUpdate);

      socket.off("call:started", handleCallStarted);
      socket.off("call:stopped", handleCallStopped);
    };
  }, []);

  function joinRoom(roomCode, user) {
    const setup = JSON.parse(
      localStorage.getItem("room_setup") || "null"
    );

    const join = () => {
      console.log("Joining room:", roomCode);

      socket.emit("room:join", {
        roomCode,
        roomName:
          setup?.code === roomCode
            ? setup.name
            : undefined,
        videoId:
          setup?.code === roomCode
            ? setup.video
            : undefined,
      });
    };

    if (socket.connected) {
      join();
    } else {
      socket.once("connect", join);
      connectSocket();
    }
  }

  function leaveRoom() {
    if (socket.connected) {
      socket.emit("room:leave");
    }

    setRoom(null);
    setParticipants([]);
    setMessages([]);

    setPlayback({
      playing: false,
      currentTime: 0,
      videoId: "",
    });

    setCallActive(false);
  }

  return (
    <RoomContext.Provider
      value={{
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
        joinRoom,
        leaveRoom,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  return useContext(RoomContext);
}
```;

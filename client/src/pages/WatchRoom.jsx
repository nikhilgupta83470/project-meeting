import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRoom } from "../context/RoomContext";
import VideoPlayer from "../components/VideoPlayer";
import Participants from "../components/Participants";
import Chat from "../components/Chat";
import MeetingControls from "../components/MeetingControls";
import ConnectionStatus from "../components/ConnectionStatus";
import VideoCall from "../components/VideoCall";
import { getYouTubeId } from "../utils/helpers";
import React from "react";

export default function WatchRoom() {
  const { code } = useParams();
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const {
    socket,
    room,
    participants,
    messages,
    connected,
    playback,
    callActive,
    setCallActive,
    joinRoom,
    leaveRoom,
  } = useRoom();

  const [videoId, setVideoId] = useState("");
  const [showCall, setShowCall] = useState(false);

  // Reference to the actual YouTube player
  const videoPlayerRef = useRef(null);

  const me = useMemo(
    () =>
      participants.find(
        (p) =>
          p.id === user?.id || p.id === user?._id || p.email === user?.email,
      ) || {
        ...user,
        id: user?.id || user?._id,
        role: "Participant",
      },
    [participants, user],
  );
 console.log("USER:", user);
 console.log("PARTICIPANTS:", participants);
 console.log("ME:", me);
  const inviteUrl = `${window.location.origin}/room/${code}?call=1`;

  useEffect(() => {
    const setup = JSON.parse(localStorage.getItem("room_setup") || "{}");

    setVideoId(getYouTubeId(setup.video || ""));

    joinRoom(code, user);

    return () => leaveRoom();
  }, [code]);

  useEffect(() => {
    if (callActive && searchParams.get("call") === "1") {
      setShowCall(true);
    }
  }, [callActive, searchParams]);

  /*
   * Play video from the CURRENT position.
   */
  function handlePlay() {
    const actualTime =
      videoPlayerRef.current?.getCurrentTime?.() ?? playback.currentTime ?? 0;

    console.log("PLAY TIME:", actualTime);

    socket.emit("playback:update", {
      playing: true,
      currentTime: actualTime,
    });
  }

  /*
   * Pause video at the CURRENT position.
   */
  function handlePause() {
    const actualTime =
      videoPlayerRef.current?.getCurrentTime?.() ?? playback.currentTime ?? 0;

    console.log("PAUSE TIME:", actualTime);

    socket.emit("playback:update", {
      playing: false,
      currentTime: actualTime,
    });
  }

  function emitPlayback(next) {
    socket.emit("playback:update", {
      ...next,
    });
  }

  function changeVideo() {
    const value = prompt("Enter YouTube video ID or URL");

    if (!value?.trim()) return;

    const id = getYouTubeId(value.trim());

    if (!id) {
      alert("Invalid YouTube URL or video ID.");
      return;
    }

    if (me.role !== "Host") {
      alert("Only the host can change the video.");
      return;
    }

    socket.emit("video:change", {
      videoId: id,
    });
  }

  function sendChat(text) {
    socket.emit("chat:send", {
      text,
    });
  }

  function reaction(value) {
    socket.emit("reaction", {
      value,
    });
  }

  function startCall() {
    socket.emit("call:start");
    setCallActive(true);
    setShowCall(true);
  }

  const leaveCall = useCallback(() => {
    socket.emit("call:leave");
    setShowCall(false);
  }, [socket]);

  function endCallForEveryone() {
    socket.emit("call:stop");
    setShowCall(false);
    setCallActive(false);
  }

  async function invite() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Join my Watch Party",
          text: "Join my Watch Party video call",
          url: inviteUrl,
        });
      } else {
        await navigator.clipboard.writeText(inviteUrl);

        alert("Invite link copied! Share it with your friends.");
      }
    } catch {
      // User cancelled share
    }
  }

  function leave() {
    leaveRoom();
    nav("/dashboard");
  }

  return (
    <main className="meeting-page">
      <header className="meeting-top">
        <div>
          <span className="room-name">{room?.name || "Watch Room"}</span>

          <span className="room-code">#{code}</span>
        </div>

        <ConnectionStatus connected={connected} />

        <div className="meeting-header-actions">
          <button className="icon-btn" onClick={invite}>
            🔗 Invite
          </button>

          {callActive ? (
            <button className="call-btn" onClick={() => setShowCall(true)}>
              📹 {showCall ? "Video Call Open" : "Join Video Call"}
            </button>
          ) : (
            <button className="call-btn" onClick={startCall}>
              📹 Start Video Call
            </button>
          )}
        </div>
      </header>

      <div className="meeting-layout">
        <section className="stage">
          <VideoPlayer
            ref={videoPlayerRef}
            videoId={playback.videoId || videoId}
            playing={playback.playing}
            currentTime={playback.currentTime}
          />

          <div className="sync-bar">
            ● Synced with host{" "}
            <span>All playback changes are shared in real time</span>
          </div>

          <MeetingControls
            isHost={me.role === "Host"}
            playing={playback.playing}
            onPlay={handlePlay}
            onPause={handlePause}
            onSeek={(time) =>
              emitPlayback({
                currentTime: time,
              })
            }
            onChangeVideo={changeVideo}
            onRaiseHand={() => socket.emit("raise-hand")}
            onReaction={reaction}
            onLeave={leave}
          />
        </section>

        <aside className="sidebar">
          <Participants participants={participants} currentUser={me} />

          <Chat messages={messages} onSend={sendChat} />
        </aside>
      </div>

      {showCall && callActive && (
        <VideoCall
          socket={socket}
          participants={participants}
          currentUser={me}
          inviteUrl={inviteUrl}
          onEndCall={leaveCall}
          onEndForEveryone={me.role === "Host" ? endCallForEveryone : undefined}
        />
      )}
    </main>
  );
}
